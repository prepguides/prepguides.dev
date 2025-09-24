package main

import (
	"fmt"
	"math"
)

// TreeNode represents a node in the binary search tree
type TreeNode struct {
	Value int
	Left  *TreeNode
	Right *TreeNode
}

// BinarySearchTree represents the BST data structure
type BinarySearchTree struct {
	Root *TreeNode
}

// NewBinarySearchTree creates a new empty BST
func NewBinarySearchTree() *BinarySearchTree {
	return &BinarySearchTree{Root: nil}
}

// Insert adds a new value to the BST
func (bst *BinarySearchTree) Insert(value int) {
	bst.Root = bst.insertNode(bst.Root, value)
}

// insertNode is a helper method for insertion
func (bst *BinarySearchTree) insertNode(node *TreeNode, value int) *TreeNode {
	// Base case: create new node
	if node == nil {
		return &TreeNode{Value: value}
	}

	// Recursive case: traverse to appropriate position
	if value < node.Value {
		node.Left = bst.insertNode(node.Left, value)
	} else if value > node.Value {
		node.Right = bst.insertNode(node.Right, value)
	}
	// If value == node.Value, do nothing (no duplicates)

	return node
}

// Search looks for a value in the BST
func (bst *BinarySearchTree) Search(value int) bool {
	return bst.searchNode(bst.Root, value)
}

// searchNode is a helper method for search
func (bst *BinarySearchTree) searchNode(node *TreeNode, value int) bool {
	// Base case: value not found
	if node == nil {
		return false
	}

	// Base case: value found
	if value == node.Value {
		return true
	}

	// Recursive case: traverse based on comparison
	if value < node.Value {
		return bst.searchNode(node.Left, value)
	}
	return bst.searchNode(node.Right, value)
}

// Delete removes a value from the BST
func (bst *BinarySearchTree) Delete(value int) {
	bst.Root = bst.deleteNode(bst.Root, value)
}

// deleteNode is a helper method for deletion
func (bst *BinarySearchTree) deleteNode(node *TreeNode, value int) *TreeNode {
	// Base case: value not found
	if node == nil {
		return nil
	}

	// Recursive case: traverse to find the node
	if value < node.Value {
		node.Left = bst.deleteNode(node.Left, value)
	} else if value > node.Value {
		node.Right = bst.deleteNode(node.Right, value)
	} else {
		// Node found, handle deletion based on children
		if node.Left == nil {
			return node.Right
		} else if node.Right == nil {
			return node.Left
		}

		// Node has two children: find inorder successor
		minNode := bst.findMin(node.Right)
		node.Value = minNode.Value
		node.Right = bst.deleteNode(node.Right, minNode.Value)
	}

	return node
}

// findMin finds the minimum value node in a subtree
func (bst *BinarySearchTree) findMin(node *TreeNode) *TreeNode {
	for node.Left != nil {
		node = node.Left
	}
	return node
}

// InorderTraversal performs inorder traversal (left, root, right)
func (bst *BinarySearchTree) InorderTraversal() []int {
	var result []int
	bst.inorderHelper(bst.Root, &result)
	return result
}

// inorderHelper is a helper method for inorder traversal
func (bst *BinarySearchTree) inorderHelper(node *TreeNode, result *[]int) {
	if node != nil {
		bst.inorderHelper(node.Left, result)
		*result = append(*result, node.Value)
		bst.inorderHelper(node.Right, result)
	}
}

// PreorderTraversal performs preorder traversal (root, left, right)
func (bst *BinarySearchTree) PreorderTraversal() []int {
	var result []int
	bst.preorderHelper(bst.Root, &result)
	return result
}

// preorderHelper is a helper method for preorder traversal
func (bst *BinarySearchTree) preorderHelper(node *TreeNode, result *[]int) {
	if node != nil {
		*result = append(*result, node.Value)
		bst.preorderHelper(node.Left, result)
		bst.preorderHelper(node.Right, result)
	}
}

// PostorderTraversal performs postorder traversal (left, right, root)
func (bst *BinarySearchTree) PostorderTraversal() []int {
	var result []int
	bst.postorderHelper(bst.Root, &result)
	return result
}

// postorderHelper is a helper method for postorder traversal
func (bst *BinarySearchTree) postorderHelper(node *TreeNode, result *[]int) {
	if node != nil {
		bst.postorderHelper(node.Left, result)
		bst.postorderHelper(node.Right, result)
		*result = append(*result, node.Value)
	}
}

// LevelOrderTraversal performs level-order traversal (breadth-first)
func (bst *BinarySearchTree) LevelOrderTraversal() []int {
	if bst.Root == nil {
		return []int{}
	}

	var result []int
	queue := []*TreeNode{bst.Root}

	for len(queue) > 0 {
		node := queue[0]
		queue = queue[1:]
		result = append(result, node.Value)

		if node.Left != nil {
			queue = append(queue, node.Left)
		}
		if node.Right != nil {
			queue = append(queue, node.Right)
		}
	}

	return result
}

// Height returns the height of the tree
func (bst *BinarySearchTree) Height() int {
	return bst.heightHelper(bst.Root)
}

// heightHelper is a helper method for calculating height
func (bst *BinarySearchTree) heightHelper(node *TreeNode) int {
	if node == nil {
		return -1
	}
	return 1 + int(math.Max(float64(bst.heightHelper(node.Left)), float64(bst.heightHelper(node.Right))))
}

// IsBalanced checks if the tree is balanced
func (bst *BinarySearchTree) IsBalanced() bool {
	return bst.isBalancedHelper(bst.Root) != -1
}

// isBalancedHelper returns -1 if unbalanced, otherwise returns height
func (bst *BinarySearchTree) isBalancedHelper(node *TreeNode) int {
	if node == nil {
		return 0
	}

	leftHeight := bst.isBalancedHelper(node.Left)
	if leftHeight == -1 {
		return -1
	}

	rightHeight := bst.isBalancedHelper(node.Right)
	if rightHeight == -1 {
		return -1
	}

	if int(math.Abs(float64(leftHeight-rightHeight))) > 1 {
		return -1
	}

	return 1 + int(math.Max(float64(leftHeight), float64(rightHeight)))
}

// Size returns the number of nodes in the tree
func (bst *BinarySearchTree) Size() int {
	return bst.sizeHelper(bst.Root)
}

// sizeHelper is a helper method for calculating size
func (bst *BinarySearchTree) sizeHelper(node *TreeNode) int {
	if node == nil {
		return 0
	}
	return 1 + bst.sizeHelper(node.Left) + bst.sizeHelper(node.Right)
}

// IsEmpty checks if the tree is empty
func (bst *BinarySearchTree) IsEmpty() bool {
	return bst.Root == nil
}

// Clear removes all nodes from the tree
func (bst *BinarySearchTree) Clear() {
	bst.Root = nil
}

// String returns a string representation of the tree
func (bst *BinarySearchTree) String() string {
	if bst.Root == nil {
		return "Empty BST"
	}
	return bst.stringHelper(bst.Root, 0)
}

// stringHelper creates a visual representation of the tree
func (bst *BinarySearchTree) stringHelper(node *TreeNode, depth int) string {
	if node == nil {
		return ""
	}

	result := ""
	for i := 0; i < depth; i++ {
		result += "  "
	}
	result += fmt.Sprintf("%d\n", node.Value)

	if node.Left != nil {
		result += bst.stringHelper(node.Left, depth+1)
	}
	if node.Right != nil {
		result += bst.stringHelper(node.Right, depth+1)
	}

	return result
}

// Example usage and demonstration
func main() {
	// Create a new BST
	bst := NewBinarySearchTree()

	// Insert values
	values := []int{50, 30, 70, 20, 40, 60, 80, 10, 25, 35, 45}
	fmt.Println("Inserting values:", values)
	for _, value := range values {
		bst.Insert(value)
	}

	// Display tree structure
	fmt.Println("\nTree structure:")
	fmt.Print(bst.String())

	// Perform traversals
	fmt.Println("Inorder traversal:", bst.InorderTraversal())
	fmt.Println("Preorder traversal:", bst.PreorderTraversal())
	fmt.Println("Postorder traversal:", bst.PostorderTraversal())
	fmt.Println("Level-order traversal:", bst.LevelOrderTraversal())

	// Search operations
	fmt.Println("\nSearch operations:")
	fmt.Printf("Search 40: %t\n", bst.Search(40))
	fmt.Printf("Search 90: %t\n", bst.Search(90))

	// Tree properties
	fmt.Println("\nTree properties:")
	fmt.Printf("Height: %d\n", bst.Height())
	fmt.Printf("Size: %d\n", bst.Size())
	fmt.Printf("Is balanced: %t\n", bst.IsBalanced())
	fmt.Printf("Is empty: %t\n", bst.IsEmpty())

	// Delete operations
	fmt.Println("\nDeleting 30:")
	bst.Delete(30)
	fmt.Println("Inorder after deletion:", bst.InorderTraversal())
	fmt.Printf("Size after deletion: %d\n", bst.Size())
}
