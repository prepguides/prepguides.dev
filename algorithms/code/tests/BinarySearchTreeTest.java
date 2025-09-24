import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import static org.junit.jupiter.api.Assertions.*;

import java.util.Arrays;
import java.util.List;

/**
 * Comprehensive test suite for BinarySearchTree implementation
 */
public class BinarySearchTreeTest {
    
    private BinarySearchTree bst;
    
    @BeforeEach
    void setUp() {
        bst = new BinarySearchTree();
    }
    
    @Test
    @DisplayName("Test inserting into empty tree")
    void testInsertIntoEmptyTree() {
        bst.insert(50);
        assertNotNull(bst.root, "Root should not be null after insertion");
        assertEquals(50, bst.root.value, "Root value should be 50");
    }
    
    @Test
    @DisplayName("Test inserting smaller and larger values")
    void testInsertSmallerAndLargerValues() {
        bst.insert(50);
        bst.insert(30);
        bst.insert(70);
        
        assertNotNull(bst.root.left, "Left child should not be null");
        assertEquals(30, bst.root.left.value, "Left child value should be 30");
        
        assertNotNull(bst.root.right, "Right child should not be null");
        assertEquals(70, bst.root.right.value, "Right child value should be 70");
    }
    
    @Test
    @DisplayName("Test inserting duplicate values")
    void testInsertDuplicateValues() {
        bst.insert(50);
        int originalSize = bst.size();
        
        bst.insert(50); // Insert duplicate
        
        assertEquals(originalSize, bst.size(), "Size should not change after inserting duplicate");
    }
    
    @Test
    @DisplayName("Test searching for existing values")
    void testSearchExistingValues() {
        int[] values = {50, 30, 70, 20, 40, 60, 80};
        
        // Insert values
        for (int value : values) {
            bst.insert(value);
        }
        
        // Test searching for existing values
        for (int value : values) {
            assertTrue(bst.search(value), "Should find value " + value);
        }
    }
    
    @Test
    @DisplayName("Test searching for non-existing values")
    void testSearchNonExistingValues() {
        int[] values = {50, 30, 70, 20, 40, 60, 80};
        int[] nonExisting = {10, 25, 35, 45, 55, 65, 75, 85, 100};
        
        // Insert values
        for (int value : values) {
            bst.insert(value);
        }
        
        // Test searching for non-existing values
        for (int value : nonExisting) {
            assertFalse(bst.search(value), "Should not find value " + value);
        }
    }
    
    @Test
    @DisplayName("Test searching in empty tree")
    void testSearchInEmptyTree() {
        assertFalse(bst.search(50), "Search in empty tree should return false");
    }
    
    @Test
    @DisplayName("Test deleting leaf node")
    void testDeleteLeafNode() {
        int[] values = {50, 30, 70, 20, 40, 60, 80, 10, 25, 35, 45};
        
        // Insert values
        for (int value : values) {
            bst.insert(value);
        }
        
        int originalSize = bst.size();
        
        // Delete leaf node
        bst.delete(10);
        
        assertFalse(bst.search(10), "Value 10 should be deleted");
        assertEquals(originalSize - 1, bst.size(), "Size should decrease by 1");
    }
    
    @Test
    @DisplayName("Test deleting node with one child")
    void testDeleteNodeWithOneChild() {
        int[] values = {50, 30, 70, 20, 40, 60, 80, 10, 25, 35, 45};
        
        // Insert values
        for (int value : values) {
            bst.insert(value);
        }
        
        // Delete node with one child
        bst.delete(20);
        
        assertFalse(bst.search(20), "Value 20 should be deleted");
    }
    
    @Test
    @DisplayName("Test deleting node with two children")
    void testDeleteNodeWithTwoChildren() {
        int[] values = {50, 30, 70, 20, 40, 60, 80, 10, 25, 35, 45};
        
        // Insert values
        for (int value : values) {
            bst.insert(value);
        }
        
        // Delete node with two children
        bst.delete(30);
        
        assertFalse(bst.search(30), "Value 30 should be deleted");
    }
    
    @Test
    @DisplayName("Test deleting non-existing value")
    void testDeleteNonExistingValue() {
        int[] values = {50, 30, 70, 20, 40, 60, 80};
        
        // Insert values
        for (int value : values) {
            bst.insert(value);
        }
        
        int originalSize = bst.size();
        
        // Delete non-existing value
        bst.delete(999);
        
        assertEquals(originalSize, bst.size(), "Size should not change after deleting non-existing value");
    }
    
    @Test
    @DisplayName("Test deleting from empty tree")
    void testDeleteFromEmptyTree() {
        // Should not throw exception
        assertDoesNotThrow(() -> bst.delete(50), "Deleting from empty tree should not throw exception");
    }
    
    @Test
    @DisplayName("Test inorder traversal")
    void testInorderTraversal() {
        int[] values = {50, 30, 70, 20, 40, 60, 80};
        
        // Insert values
        for (int value : values) {
            bst.insert(value);
        }
        
        List<Integer> expected = Arrays.asList(20, 30, 40, 50, 60, 70, 80);
        List<Integer> actual = bst.inorderTraversal();
        
        assertEquals(expected, actual, "Inorder traversal should be sorted");
    }
    
    @Test
    @DisplayName("Test preorder traversal")
    void testPreorderTraversal() {
        int[] values = {50, 30, 70, 20, 40, 60, 80};
        
        // Insert values
        for (int value : values) {
            bst.insert(value);
        }
        
        List<Integer> expected = Arrays.asList(50, 30, 20, 40, 70, 60, 80);
        List<Integer> actual = bst.preorderTraversal();
        
        assertEquals(expected, actual, "Preorder traversal should match expected order");
    }
    
    @Test
    @DisplayName("Test postorder traversal")
    void testPostorderTraversal() {
        int[] values = {50, 30, 70, 20, 40, 60, 80};
        
        // Insert values
        for (int value : values) {
            bst.insert(value);
        }
        
        List<Integer> expected = Arrays.asList(20, 40, 30, 60, 80, 70, 50);
        List<Integer> actual = bst.postorderTraversal();
        
        assertEquals(expected, actual, "Postorder traversal should match expected order");
    }
    
    @Test
    @DisplayName("Test level-order traversal")
    void testLevelOrderTraversal() {
        int[] values = {50, 30, 70, 20, 40, 60, 80};
        
        // Insert values
        for (int value : values) {
            bst.insert(value);
        }
        
        List<Integer> expected = Arrays.asList(50, 30, 70, 20, 40, 60, 80);
        List<Integer> actual = bst.levelOrderTraversal();
        
        assertEquals(expected, actual, "Level-order traversal should match expected order");
    }
    
    @Test
    @DisplayName("Test traversals on empty tree")
    void testTraversalsOnEmptyTree() {
        assertTrue(bst.inorderTraversal().isEmpty(), "Inorder traversal of empty tree should be empty");
        assertTrue(bst.preorderTraversal().isEmpty(), "Preorder traversal of empty tree should be empty");
        assertTrue(bst.postorderTraversal().isEmpty(), "Postorder traversal of empty tree should be empty");
        assertTrue(bst.levelOrderTraversal().isEmpty(), "Level-order traversal of empty tree should be empty");
    }
    
    @Test
    @DisplayName("Test height of empty tree")
    void testHeightOfEmptyTree() {
        assertEquals(-1, bst.height(), "Height of empty tree should be -1");
    }
    
    @Test
    @DisplayName("Test height of single node")
    void testHeightOfSingleNode() {
        bst.insert(50);
        assertEquals(0, bst.height(), "Height of single node should be 0");
    }
    
    @Test
    @DisplayName("Test height of balanced tree")
    void testHeightOfBalancedTree() {
        int[] values = {50, 30, 70, 20, 40, 60, 80};
        
        for (int value : values) {
            bst.insert(value);
        }
        
        assertEquals(2, bst.height(), "Height of balanced tree should be 2");
    }
    
    @Test
    @DisplayName("Test height of unbalanced tree")
    void testHeightOfUnbalancedTree() {
        // Create unbalanced tree (all nodes to the right)
        for (int i = 1; i <= 5; i++) {
            bst.insert(i);
        }
        
        assertEquals(4, bst.height(), "Height of unbalanced tree should be 4");
    }
    
    @Test
    @DisplayName("Test size operations")
    void testSizeOperations() {
        // Test size of empty tree
        assertEquals(0, bst.size(), "Size of empty tree should be 0");
        
        // Test size after insertions
        int[] values = {50, 30, 70, 20, 40, 60, 80};
        for (int i = 0; i < values.length; i++) {
            bst.insert(values[i]);
            assertEquals(i + 1, bst.size(), "Size should be " + (i + 1) + " after inserting " + values[i]);
        }
        
        // Test size after deletion
        bst.delete(20);
        assertEquals(6, bst.size(), "Size should be 6 after deletion");
    }
    
    @Test
    @DisplayName("Test balance checking")
    void testBalanceChecking() {
        // Test empty tree is balanced
        assertTrue(bst.isBalanced(), "Empty tree should be balanced");
        
        // Test single node is balanced
        bst.insert(50);
        assertTrue(bst.isBalanced(), "Single node should be balanced");
        
        // Test balanced tree
        int[] values = {50, 30, 70, 20, 40, 60, 80};
        for (int value : values) {
            bst.insert(value);
        }
        assertTrue(bst.isBalanced(), "Balanced tree should be balanced");
        
        // Test unbalanced tree
        BinarySearchTree unbalancedBST = new BinarySearchTree();
        for (int i = 1; i <= 5; i++) {
            unbalancedBST.insert(i);
        }
        assertFalse(unbalancedBST.isBalanced(), "Unbalanced tree should not be balanced");
    }
    
    @Test
    @DisplayName("Test empty checking")
    void testEmptyChecking() {
        // Test empty tree
        assertTrue(bst.isEmpty(), "New tree should be empty");
        
        // Test non-empty tree
        bst.insert(50);
        assertFalse(bst.isEmpty(), "Tree with nodes should not be empty");
    }
    
    @Test
    @DisplayName("Test clear operation")
    void testClearOperation() {
        int[] values = {50, 30, 70, 20, 40, 60, 80};
        
        // Insert values
        for (int value : values) {
            bst.insert(value);
        }
        
        // Verify tree is not empty
        assertFalse(bst.isEmpty(), "Tree should not be empty before clear");
        
        // Clear tree
        bst.clear();
        
        // Verify tree is empty
        assertTrue(bst.isEmpty(), "Tree should be empty after clear");
        assertEquals(0, bst.size(), "Size should be 0 after clear");
        assertNull(bst.root, "Root should be null after clear");
    }
    
    @Test
    @DisplayName("Test string representation")
    void testStringRepresentation() {
        // Test empty tree string representation
        String emptyStr = bst.toString();
        assertEquals("Empty BST", emptyStr, "Empty tree should return 'Empty BST'");
        
        // Test non-empty tree string representation
        bst.insert(50);
        bst.insert(30);
        bst.insert(70);
        
        String str = bst.toString();
        assertNotNull(str, "String representation should not be null");
        assertFalse(str.isEmpty(), "String representation should not be empty");
    }
    
    @Test
    @DisplayName("Test complex operations sequence")
    void testComplexOperationsSequence() {
        // Insert multiple values
        int[] values = {50, 30, 70, 20, 40, 60, 80, 10, 25, 35, 45};
        for (int value : values) {
            bst.insert(value);
        }
        
        // Verify initial state
        assertEquals(11, bst.size(), "Initial size should be 11");
        assertTrue(bst.isBalanced(), "Tree should be balanced");
        
        // Perform various operations
        assertTrue(bst.search(40), "Should find value 40");
        assertFalse(bst.search(90), "Should not find value 90");
        
        // Delete some values
        bst.delete(10);
        bst.delete(30);
        bst.delete(70);
        
        // Verify final state
        assertEquals(8, bst.size(), "Final size should be 8");
        assertFalse(bst.search(10), "Should not find deleted value 10");
        assertFalse(bst.search(30), "Should not find deleted value 30");
        assertFalse(bst.search(70), "Should not find deleted value 70");
        
        // Verify traversals still work
        List<Integer> inorder = bst.inorderTraversal();
        assertFalse(inorder.isEmpty(), "Inorder traversal should not be empty");
        assertTrue(inorder.size() == 8, "Inorder traversal should have 8 elements");
    }
}
