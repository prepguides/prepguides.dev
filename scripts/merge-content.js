#!/usr/bin/env node

/**
 * Content Merge Engine
 * Combines base.json with payload files to generate the final content-config.json
 */

const fs = require('fs');
const path = require('path');

// Configuration
const BASE_CONFIG_FILE = 'base.json';
const CONTENT_CONFIG_FILE = 'content-config.json';
const PAYLOADS_DIR = '.github/content-payloads';

/**
 * Load base configuration
 */
function loadBaseConfig() {
  try {
    const basePath = path.resolve(BASE_CONFIG_FILE);
    const baseData = fs.readFileSync(basePath, 'utf8');
    return JSON.parse(baseData);
  } catch (error) {
    console.error('Error loading base config:', error.message);
    process.exit(1);
  }
}

/**
 * Load payload files from current PR only
 */
function loadPayloads() {
  const payloads = [];
  
  try {
    if (!fs.existsSync(PAYLOADS_DIR)) {
      console.log('No payloads directory found, using base config only');
      return payloads;
    }
    
    // Check if we're in a PR context by looking for changed files
    const changedFiles = getChangedFiles();
    const payloadFiles = changedFiles.filter(file => 
      file.startsWith('.github/content-payloads/') && file.endsWith('.json')
    );
    
    if (payloadFiles.length === 0) {
      console.log('No new payload files in this PR, using base config only');
      return payloads;
    }
    
    console.log(`📋 Found ${payloadFiles.length} new payload file(s) in this PR`);
    
    for (const file of payloadFiles) {
      try {
        const filePath = path.resolve(file);
        const fileData = fs.readFileSync(filePath, 'utf8');
        const payload = JSON.parse(fileData);
        
        // Validate payload structure
        if (validatePayload(payload)) {
          payloads.push(payload);
          console.log(`✅ Loaded new payload: ${path.basename(file)}`);
        } else {
          console.error(`❌ Invalid payload structure: ${file}`);
        }
      } catch (error) {
        console.error(`❌ Error loading payload ${file}:`, error.message);
      }
    }
  } catch (error) {
    console.error('Error loading payloads:', error.message);
  }
  
  return payloads;
}

/**
 * Get changed files in current PR
 */
function getChangedFiles() {
  try {
    const { execSync } = require('child_process');
    
    // Try to get changed files from git diff
    try {
      const diffOutput = execSync('git diff --name-only HEAD~1 HEAD', { encoding: 'utf8' });
      return diffOutput.trim().split('\n').filter(file => file.length > 0);
    } catch (error) {
      // Fallback: if not in a PR context, process all files
      console.log('Not in PR context, processing all payload files');
      const files = fs.readdirSync(PAYLOADS_DIR);
      return files.filter(file => file.endsWith('.json')).map(file => 
        path.join(PAYLOADS_DIR, file)
      );
    }
  } catch (error) {
    console.error('Error getting changed files:', error.message);
    return [];
  }
}

/**
 * Validate payload structure
 */
function validatePayload(payload) {
  const requiredFields = ['version', 'type', 'metadata', 'content'];
  
  for (const field of requiredFields) {
    if (!payload[field]) {
      console.error(`Missing required field: ${field}`);
      return false;
    }
  }
  
  const requiredMetadata = ['title', 'category', 'subtopic'];
  for (const field of requiredMetadata) {
    if (!payload.metadata[field]) {
      console.error(`Missing required metadata field: ${field}`);
      return false;
    }
  }
  
  const requiredContent = ['id', 'title', 'description'];
  for (const field of requiredContent) {
    if (!payload.content[field]) {
      console.error(`Missing required content field: ${field}`);
      return false;
    }
  }
  
  return true;
}

/**
 * Merge payload into base configuration
 */
function mergePayload(baseConfig, payload) {
  const { metadata, content } = payload;
  const { category, subtopic } = metadata;
  
  // Ensure category exists
  if (!baseConfig.categories[category]) {
    console.error(`Category '${category}' does not exist in base config`);
    return false;
  }
  
  // Ensure subtopic exists or create it
  if (!baseConfig.categories[category].subtopics[subtopic]) {
    baseConfig.categories[category].subtopics[subtopic] = {
      name: subtopic.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      description: content.description,
      content: []
    };
  }
  
  // Check if content with this ID already exists to avoid duplicates
  const existingContentIndex = baseConfig.categories[category].subtopics[subtopic].content
    .findIndex(item => item.id === content.id);
  
  if (existingContentIndex !== -1) {
    // Update existing content
    baseConfig.categories[category].subtopics[subtopic].content[existingContentIndex] = {
      ...content,
      addedDate: metadata.submissionDate || new Date().toISOString().split('T')[0],
      status: content.status || 'active'
    };
    console.log(`🔄 Updated existing content: ${content.title}`);
  } else {
    // Add new content
    baseConfig.categories[category].subtopics[subtopic].content.push({
      ...content,
      addedDate: metadata.submissionDate || new Date().toISOString().split('T')[0],
      status: content.status || 'active'
    });
    console.log(`➕ Added new content: ${content.title}`);
  }
  
  return true;
}

/**
 * Update statistics
 */
function updateStatistics(baseConfig) {
  let totalContent = 0;
  let totalVisualizations = 0;
  let totalGuides = 0;
  let categoriesWithContent = 0;
  let lastContentAdded = baseConfig.statistics.lastContentAdded;
  
  for (const [categoryId, category] of Object.entries(baseConfig.categories)) {
    if (Object.keys(category.subtopics).length > 0) {
      categoriesWithContent++;
      
      for (const [subtopicId, subtopic] of Object.entries(category.subtopics)) {
        for (const contentItem of subtopic.content) {
          if (contentItem.status === 'active') {
            totalContent++;
            if (contentItem.type === 'visualization') {
              totalVisualizations++;
            } else {
              totalGuides++;
            }
            
            // Update last content added date
            if (contentItem.addedDate > lastContentAdded) {
              lastContentAdded = contentItem.addedDate;
            }
          }
        }
      }
    }
  }
  
  baseConfig.statistics = {
    totalContent,
    totalVisualizations,
    totalGuides,
    categoriesWithContent,
    lastContentAdded
  };
  
  return baseConfig;
}

/**
 * Generate content report
 */
function generateReport(baseConfig, payloads) {
  console.log('\n📊 Content Merge Report');
  console.log('========================');
  console.log(`Base content items: ${baseConfig.statistics.totalContent}`);
  console.log(`Payloads processed: ${payloads.length}`);
  console.log(`Final content items: ${baseConfig.statistics.totalContent}`);
  console.log(`Visualizations: ${baseConfig.statistics.totalVisualizations}`);
  console.log(`Guides: ${baseConfig.statistics.totalGuides}`);
  console.log(`Active categories: ${baseConfig.statistics.categoriesWithContent}`);
  console.log(`Last updated: ${baseConfig.statistics.lastContentAdded}`);
  
  console.log('\n📋 Content by Category');
  console.log('======================');
  for (const [categoryId, category] of Object.entries(baseConfig.categories)) {
    if (Object.keys(category.subtopics).length > 0) {
      console.log(`\n${category.icon} ${category.name}`);
      for (const [subtopicId, subtopic] of Object.entries(category.subtopics)) {
        if (subtopic.content.length > 0) {
          console.log(`  📁 ${subtopic.name} (${subtopic.content.length} items)`);
          for (const contentItem of subtopic.content) {
            const status = contentItem.status === 'active' ? '✅' : '🚧';
            const type = contentItem.type === 'visualization' ? '🎨' : '📚';
            console.log(`    ${status} ${type} ${contentItem.title}`);
          }
        }
      }
    }
  }
}

/**
 * Main execution
 */
function main() {
  console.log('🔄 Starting content merge process...');
  
  // Load base configuration
  const baseConfig = loadBaseConfig();
  console.log(`✅ Loaded base configuration`);
  
  // Load payloads
  const payloads = loadPayloads();
  console.log(`✅ Loaded ${payloads.length} payload(s)`);
  
  // Merge each payload
  let mergedCount = 0;
  for (const payload of payloads) {
    if (mergePayload(baseConfig, payload)) {
      mergedCount++;
      console.log(`✅ Merged payload: ${payload.metadata.title}`);
    } else {
      console.error(`❌ Failed to merge payload: ${payload.metadata.title}`);
    }
  }
  
  // Update statistics
  updateStatistics(baseConfig);
  console.log(`✅ Updated statistics`);
  
  // Generate report
  generateReport(baseConfig, payloads);
  
  // Write final configuration
  const finalConfig = JSON.stringify(baseConfig, null, 2);
  fs.writeFileSync(CONTENT_CONFIG_FILE, finalConfig, 'utf8');
  console.log(`\n✅ Generated ${CONTENT_CONFIG_FILE}`);
  
  console.log(`\n🎉 Content merge completed successfully!`);
  console.log(`   - Processed ${payloads.length} payload(s)`);
  console.log(`   - Successfully merged ${mergedCount} payload(s)`);
  console.log(`   - Generated final configuration`);
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  loadBaseConfig,
  loadPayloads,
  validatePayload,
  mergePayload,
  updateStatistics,
  generateReport
};
