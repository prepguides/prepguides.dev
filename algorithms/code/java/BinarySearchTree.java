import java.util.*;

/**
 * Binary Search Tree implementation in Java
 * Provides comprehensive BST operations with proper error handling and documentation
 */
public class BinarySearchTree {
    
    /**
     * TreeNode represents a node in the binary search tree
     */
    public static class TreeNode {
        public int value;
        public TreeNode left;
        public TreeNode right;
        
        public TreeNode(int value) {
            this.value = value;
            this.left = null;
            this.right = null;
        }
        
        @Override
        public String toString() {
            return String.valueOf(value);
        }
    }
    
    private TreeNode root;
    
    /**
     * Constructor - creates an empty BST
     */
    public BinarySearchTree() {
        this.root = null;
    }
    
    /**
     * Insert a new value into the BST
     * @param value the value to insert
     */
    public void insert(int value) {
        root = insertNode(root, value);
    }
    
    /**
     * Helper method for insertion
     * @param node current node
     * @param value value to insert
     * @return the updated node
     */
    private TreeNode insertNode(TreeNode node, int value) {
        // Base case: create new node
        if (node == null) {
            return new TreeNode(value);
        }
        
        // Recursive case: traverse to appropriate position
        if (value < node.value) {
            node.left = insertNode(node.left, value);
        } else if (value > node.value) {
            node.right = insertNode(node.right, value);
        }
        // If value == node.value, do nothing (no duplicates)
        
        return node;
    }
    
    /**
     * Search for a value in the BST
     * @param value the value to search for
     * @return true if found, false otherwise
     */
    public boolean search(int value) {
        return searchNode(root, value);
    }
    
    /**
     * Helper method for search
     * @param node current node
     * @param value value to search for
     * @return true if found, false otherwise
     */
    private boolean searchNode(TreeNode node, int value) {
        // Base case: value not found
        if (node == null) {
            return false;
        }
        
        // Base case: value found
        if (value == node.value) {
            return true;
        }
        
        // Recursive case: traverse based on comparison
        if (value < node.value) {
            return searchNode(node.left, value);
        }
        return searchNode(node.right, value);
    }
    
    /**
     * Delete a value from the BST
     * @param value the value to delete
     */
    public void delete(int value) {
        root = deleteNode(root, value);
    }
    
    /**
     * Helper method for deletion
     * @param node current node
     * @param value value to delete
     * @return the updated node
     */
    private TreeNode deleteNode(TreeNode node, int value) {
        // Base case: value not found
        if (node == null) {
            return null;
        }
        
        // Recursive case: traverse to find the node
        if (value < node.value) {
            node.left = deleteNode(node.left, value);
        } else if (value > node.value) {
            node.right = deleteNode(node.right, value);
        } else {
            // Node found, handle deletion based on children
            if (node.left == null) {
                return node.right;
            } else if (node.right == null) {
                return node.left;
            }
            
            // Node has two children: find inorder successor
            TreeNode minNode = findMin(node.right);
            node.value = minNode.value;
            node.right = deleteNode(node.right, minNode.value);
        }
        
        return node;
    }
    
    /**
     * Find the minimum value node in a subtree
     * @param node the root of the subtree
     * @return the minimum value node
     */
    private TreeNode findMin(TreeNode node) {
        while (node.left != null) {
            node = node.left;
        }
        return node;
    }
    
    /**
     * Perform inorder traversal (left, root, right)
     * @return list of values in inorder
     */
    public List<Integer> inorderTraversal() {
        List<Integer> result = new ArrayList<>();
        inorderHelper(root, result);
        return result;
    }
    
    /**
     * Helper method for inorder traversal
     * @param node current node
     * @param result list to store results
     */
    private void inorderHelper(TreeNode node, List<Integer> result) {
        if (node != null) {
            inorderHelper(node.left, result);
            result.add(node.value);
            inorderHelper(node.right, result);
        }
    }
    
    /**
     * Perform preorder traversal (root, left, right)
     * @return list of values in preorder
     */
    public List<Integer> preorderTraversal() {
        List<Integer> result = new ArrayList<>();
        preorderHelper(root, result);
        return result;
    }
    
    /**
     * Helper method for preorder traversal
     * @param node current node
     * @param result list to store results
     */
    private void preorderHelper(TreeNode node, List<Integer> result) {
        if (node != null) {
            result.add(node.value);
            preorderHelper(node.left, result);
            preorderHelper(node.right, result);
        }
    }
    
    /**
     * Perform postorder traversal (left, right, root)
     * @return list of values in postorder
     */
    public List<Integer> postorderTraversal() {
        List<Integer> result = new ArrayList<>();
        postorderHelper(root, result);
        return result;
    }
    
    /**
     * Helper method for postorder traversal
     * @param node current node
     * @param result list to store results
     */
    private void postorderHelper(TreeNode node, List<Integer> result) {
        if (node != null) {
            postorderHelper(node.left, result);
            postorderHelper(node.right, result);
            result.add(node.value);
        }
    }
    
    /**
     * Perform level-order traversal (breadth-first)
     * @return list of values in level-order
     */
    public List<Integer> levelOrderTraversal() {
        List<Integer> result = new ArrayList<>();
        if (root == null) {
            return result;
        }
        
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);
        
        while (!queue.isEmpty()) {
            TreeNode node = queue.poll();
            result.add(node.value);
            
            if (node.left != null) {
                queue.offer(node.left);
            }
            if (node.right != null) {
                queue.offer(node.right);
            }
        }
        
        return result;
    }
    
    /**
     * Get the height of the tree
     * @return the height of the tree
     */
    public int height() {
        return heightHelper(root);
    }
    
    /**
     * Helper method for calculating height
     * @param node current node
     * @return height of the subtree
     */
    private int heightHelper(TreeNode node) {
        if (node == null) {
            return -1;
        }
        return 1 + Math.max(heightHelper(node.left), heightHelper(node.right));
    }
    
    /**
     * Check if the tree is balanced
     * @return true if balanced, false otherwise
     */
    public boolean isBalanced() {
        return isBalancedHelper(root) != -1;
    }
    
    /**
     * Helper method for checking balance
     * @param node current node
     * @return -1 if unbalanced, otherwise returns height
     */
    private int isBalancedHelper(TreeNode node) {
        if (node == null) {
            return 0;
        }
        
        int leftHeight = isBalancedHelper(node.left);
        if (leftHeight == -1) {
            return -1;
        }
        
        int rightHeight = isBalancedHelper(node.right);
        if (rightHeight == -1) {
            return -1;
        }
        
        if (Math.abs(leftHeight - rightHeight) > 1) {
            return -1;
        }
        
        return 1 + Math.max(leftHeight, rightHeight);
    }
    
    /**
     * Get the number of nodes in the tree
     * @return the size of the tree
     */
    public int size() {
        return sizeHelper(root);
    }
    
    /**
     * Helper method for calculating size
     * @param node current node
     * @return size of the subtree
     */
    private int sizeHelper(TreeNode node) {
        if (node == null) {
            return 0;
        }
        return 1 + sizeHelper(node.left) + sizeHelper(node.right);
    }
    
    /**
     * Check if the tree is empty
     * @return true if empty, false otherwise
     */
    public boolean isEmpty() {
        return root == null;
    }
    
    /**
     * Clear all nodes from the tree
     */
    public void clear() {
        root = null;
    }
    
    /**
     * Get a string representation of the tree
     * @return string representation
     */
    @Override
    public String toString() {
        if (root == null) {
            return "Empty BST";
        }
        return stringHelper(root, 0);
    }
    
    /**
     * Helper method for creating string representation
     * @param node current node
     * @param depth current depth
     * @return string representation of the subtree
     */
    private String stringHelper(TreeNode node, int depth) {
        if (node == null) {
            return "";
        }
        
        StringBuilder result = new StringBuilder();
        for (int i = 0; i < depth; i++) {
            result.append("  ");
        }
        result.append(node.value).append("\n");
        
        if (node.left != null) {
            result.append(stringHelper(node.left, depth + 1));
        }
        if (node.right != null) {
            result.append(stringHelper(node.right, depth + 1));
        }
        
        return result.toString();
    }
    
    /**
     * Main method for demonstration
     */
    public static void main(String[] args) {
        // Create a new BST
        BinarySearchTree bst = new BinarySearchTree();
        
        // Insert values
        int[] values = {50, 30, 70, 20, 40, 60, 80, 10, 25, 35, 45};
        System.out.println("Inserting values: " + Arrays.toString(values));
        for (int value : values) {
            bst.insert(value);
        }
        
        // Display tree structure
        System.out.println("\nTree structure:");
        System.out.print(bst.toString());
        
        // Perform traversals
        System.out.println("Inorder traversal: " + bst.inorderTraversal());
        System.out.println("Preorder traversal: " + bst.preorderTraversal());
        System.out.println("Postorder traversal: " + bst.postorderTraversal());
        System.out.println("Level-order traversal: " + bst.levelOrderTraversal());
        
        // Search operations
        System.out.println("\nSearch operations:");
        System.out.println("Search 40: " + bst.search(40));
        System.out.println("Search 90: " + bst.search(90));
        
        // Tree properties
        System.out.println("\nTree properties:");
        System.out.println("Height: " + bst.height());
        System.out.println("Size: " + bst.size());
        System.out.println("Is balanced: " + bst.isBalanced());
        System.out.println("Is empty: " + bst.isEmpty());
        
        // Delete operations
        System.out.println("\nDeleting 30:");
        bst.delete(30);
        System.out.println("Inorder after deletion: " + bst.inorderTraversal());
        System.out.println("Size after deletion: " + bst.size());
    }
}
