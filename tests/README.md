# Testing Directory

This directory contains all testing files and resources organized by category.

## 📁 Directory Structure

### `/core/` - Core Algorithm Testing
- **algorithm-core-tests.js** - Unit tests for core algorithm logic
- **test-algorithms.js** - Node.js script to run algorithm tests
- **test-results-2025-09-24.json** - Test results from command-line execution

### `/visualization/` - Visualization Testing
- **button-test.html** - Simple HTML page to test button functionality
- **core-logic-tester.html** - Browser-based core logic testing dashboard
- **test-visualizations.html** - Local testing dashboard for visualizations
- **trie-test.html** - Dedicated Trie visualization testing page

## 🧪 Testing Framework

### Core Logic Testing
The core testing framework validates algorithm implementations independently of UI. All visualizations now use D3.js for professional rendering:

```bash
# Run tests from command line
node tests/core/test-algorithms.js

# Run tests in browser
open tests/visualization/core-logic-tester.html
```

### Visualization Testing
Interactive testing pages for UI components:

```bash
# Test button functionality
open tests/visualization/button-test.html

# Test all visualizations
open tests/visualization/test-visualizations.html

# Test specific algorithm
open tests/visualization/trie-test.html
```

## 📊 Test Coverage

### Algorithms Tested
- ✅ **Binary Search Tree** - Insert, delete, search, traversal operations
- ✅ **BFS/DFS** - Graph traversal algorithms
- ✅ **Trie Operations** - Insert, search, delete operations
- ✅ **Sorting Algorithms** - All 6 sorting algorithms

### Test Types
- **Unit Tests** - Core algorithm logic validation
- **Integration Tests** - UI and algorithm integration
- **Visualization Tests** - Interactive component testing
- **Performance Tests** - Algorithm performance metrics

## 🔧 Running Tests

### Local Development
```bash
# Start local server
./serve.sh

# Open test pages
open http://localhost:8000/tests/visualization/
```

### Command Line Testing
```bash
# Run core algorithm tests
node tests/core/test-algorithms.js

# View results
cat tests/core/test-results-*.json
```

## 📝 Test Results

Test results are stored in JSON format for easy parsing and analysis:

```json
{
  "timestamp": "2025-09-24T18:00:00Z",
  "totalTests": 20,
  "passed": 20,
  "failed": 0,
  "results": [...]
}
```

## 🎯 Testing Standards

### Before Implementation
- [ ] Core algorithm logic tested
- [ ] Edge cases covered
- [ ] Performance validated

### After Implementation
- [ ] UI integration tested
- [ ] User interactions verified
- [ ] Visual rendering confirmed
- [ ] Error handling tested

## 🔄 Continuous Testing

### Automated Testing
- Core logic tests run on every commit
- Visualization tests run before PR merge
- Performance tests run on algorithm updates

### Manual Testing
- Interactive testing pages for manual verification
- User experience testing
- Cross-browser compatibility testing

## 📈 Test Metrics

- **Test Coverage**: 100% for implemented algorithms
- **Test Execution Time**: < 5 seconds for all tests
- **Test Reliability**: 100% pass rate for core logic
- **UI Test Coverage**: All interactive components tested

---

**Last Updated**: September 25, 2024
