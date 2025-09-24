package main

import (
	"reflect"
	"testing"
)

func TestBinarySearchTree_Insert(t *testing.T) {
	bst := NewBinarySearchTree()
	
	// Test inserting into empty tree
	bst.Insert(50)
	if bst.Root == nil || bst.Root.Value != 50 {
		t.Errorf("Expected root value 50, got %v", bst.Root)
	}
	
	// Test inserting smaller value
	bst.Insert(30)
	if bst.Root.Left == nil || bst.Root.Left.Value != 30 {
		t.Errorf("Expected left child 30, got %v", bst.Root.Left)
	}
	
	// Test inserting larger value
	bst.Insert(70)
	if bst.Root.Right == nil || bst.Root.Right.Value != 70 {
		t.Errorf("Expected right child 70, got %v", bst.Root.Right)
	}
	
	// Test inserting duplicate (should not change tree)
	originalSize := bst.Size()
	bst.Insert(50)
	if bst.Size() != originalSize {
		t.Errorf("Expected size to remain %d after duplicate insert, got %d", originalSize, bst.Size())
	}
}

func TestBinarySearchTree_Search(t *testing.T) {
	bst := NewBinarySearchTree()
	values := []int{50, 30, 70, 20, 40, 60, 80}
	
	// Insert values
	for _, value := range values {
		bst.Insert(value)
	}
	
	// Test searching for existing values
	for _, value := range values {
		if !bst.Search(value) {
			t.Errorf("Expected to find value %d, but search returned false", value)
		}
	}
	
	// Test searching for non-existing values
	nonExisting := []int{10, 25, 35, 45, 55, 65, 75, 85, 100}
	for _, value := range nonExisting {
		if bst.Search(value) {
			t.Errorf("Expected not to find value %d, but search returned true", value)
		}
	}
	
	// Test searching in empty tree
	emptyBST := NewBinarySearchTree()
	if emptyBST.Search(50) {
		t.Errorf("Expected search in empty tree to return false")
	}
}

func TestBinarySearchTree_Delete(t *testing.T) {
	bst := NewBinarySearchTree()
	values := []int{50, 30, 70, 20, 40, 60, 80, 10, 25, 35, 45}
	
	// Insert values
	for _, value := range values {
		bst.Insert(value)
	}
	
	originalSize := bst.Size()
	
	// Test deleting leaf node
	bst.Delete(10)
	if bst.Search(10) {
		t.Errorf("Expected value 10 to be deleted")
	}
	if bst.Size() != originalSize-1 {
		t.Errorf("Expected size to be %d after deletion, got %d", originalSize-1, bst.Size())
	}
	
	// Test deleting node with one child
	bst.Delete(20)
	if bst.Search(20) {
		t.Errorf("Expected value 20 to be deleted")
	}
	
	// Test deleting node with two children
	bst.Delete(30)
	if bst.Search(30) {
		t.Errorf("Expected value 30 to be deleted")
	}
	
	// Test deleting non-existing value
	originalSize = bst.Size()
	bst.Delete(999)
	if bst.Size() != originalSize {
		t.Errorf("Expected size to remain %d after deleting non-existing value, got %d", originalSize, bst.Size())
	}
	
	// Test deleting from empty tree
	emptyBST := NewBinarySearchTree()
	emptyBST.Delete(50) // Should not panic
}

func TestBinarySearchTree_Traversals(t *testing.T) {
	bst := NewBinarySearchTree()
	values := []int{50, 30, 70, 20, 40, 60, 80}
	
	// Insert values
	for _, value := range values {
		bst.Insert(value)
	}
	
	// Test inorder traversal (should be sorted)
	expectedInorder := []int{20, 30, 40, 50, 60, 70, 80}
	inorder := bst.InorderTraversal()
	if !reflect.DeepEqual(inorder, expectedInorder) {
		t.Errorf("Expected inorder %v, got %v", expectedInorder, inorder)
	}
	
	// Test preorder traversal
	expectedPreorder := []int{50, 30, 20, 40, 70, 60, 80}
	preorder := bst.PreorderTraversal()
	if !reflect.DeepEqual(preorder, expectedPreorder) {
		t.Errorf("Expected preorder %v, got %v", expectedPreorder, preorder)
	}
	
	// Test postorder traversal
	expectedPostorder := []int{20, 40, 30, 60, 80, 70, 50}
	postorder := bst.PostorderTraversal()
	if !reflect.DeepEqual(postorder, expectedPostorder) {
		t.Errorf("Expected postorder %v, got %v", expectedPostorder, postorder)
	}
	
	// Test level-order traversal
	expectedLevelOrder := []int{50, 30, 70, 20, 40, 60, 80}
	levelOrder := bst.LevelOrderTraversal()
	if !reflect.DeepEqual(levelOrder, expectedLevelOrder) {
		t.Errorf("Expected level-order %v, got %v", expectedLevelOrder, levelOrder)
	}
	
	// Test traversals on empty tree
	emptyBST := NewBinarySearchTree()
	if len(emptyBST.InorderTraversal()) != 0 {
		t.Errorf("Expected empty inorder traversal")
	}
	if len(emptyBST.LevelOrderTraversal()) != 0 {
		t.Errorf("Expected empty level-order traversal")
	}
}

func TestBinarySearchTree_Height(t *testing.T) {
	bst := NewBinarySearchTree()
	
	// Test height of empty tree
	if bst.Height() != -1 {
		t.Errorf("Expected height of empty tree to be -1, got %d", bst.Height())
	}
	
	// Test height of single node
	bst.Insert(50)
	if bst.Height() != 0 {
		t.Errorf("Expected height of single node to be 0, got %d", bst.Height())
	}
	
	// Test height of balanced tree
	values := []int{50, 30, 70, 20, 40, 60, 80}
	for _, value := range values {
		bst.Insert(value)
	}
	expectedHeight := 2
	if bst.Height() != expectedHeight {
		t.Errorf("Expected height %d, got %d", expectedHeight, bst.Height())
	}
	
	// Test height of unbalanced tree
	unbalancedBST := NewBinarySearchTree()
	for i := 1; i <= 5; i++ {
		unbalancedBST.Insert(i)
	}
	expectedUnbalancedHeight := 4
	if unbalancedBST.Height() != expectedUnbalancedHeight {
		t.Errorf("Expected unbalanced height %d, got %d", expectedUnbalancedHeight, unbalancedBST.Height())
	}
}

func TestBinarySearchTree_Size(t *testing.T) {
	bst := NewBinarySearchTree()
	
	// Test size of empty tree
	if bst.Size() != 0 {
		t.Errorf("Expected size of empty tree to be 0, got %d", bst.Size())
	}
	
	// Test size after insertions
	values := []int{50, 30, 70, 20, 40, 60, 80}
	for i, value := range values {
		bst.Insert(value)
		expectedSize := i + 1
		if bst.Size() != expectedSize {
			t.Errorf("Expected size %d after inserting %d, got %d", expectedSize, value, bst.Size())
		}
	}
	
	// Test size after deletions
	bst.Delete(20)
	expectedSize := 6
	if bst.Size() != expectedSize {
		t.Errorf("Expected size %d after deletion, got %d", expectedSize, bst.Size())
	}
}

func TestBinarySearchTree_IsBalanced(t *testing.T) {
	bst := NewBinarySearchTree()
	
	// Test empty tree is balanced
	if !bst.IsBalanced() {
		t.Errorf("Expected empty tree to be balanced")
	}
	
	// Test single node is balanced
	bst.Insert(50)
	if !bst.IsBalanced() {
		t.Errorf("Expected single node to be balanced")
	}
	
	// Test balanced tree
	values := []int{50, 30, 70, 20, 40, 60, 80}
	for _, value := range values {
		bst.Insert(value)
	}
	if !bst.IsBalanced() {
		t.Errorf("Expected balanced tree to be balanced")
	}
	
	// Test unbalanced tree
	unbalancedBST := NewBinarySearchTree()
	for i := 1; i <= 5; i++ {
		unbalancedBST.Insert(i)
	}
	if unbalancedBST.IsBalanced() {
		t.Errorf("Expected unbalanced tree to not be balanced")
	}
}

func TestBinarySearchTree_IsEmpty(t *testing.T) {
	bst := NewBinarySearchTree()
	
	// Test empty tree
	if !bst.IsEmpty() {
		t.Errorf("Expected new tree to be empty")
	}
	
	// Test non-empty tree
	bst.Insert(50)
	if bst.IsEmpty() {
		t.Errorf("Expected tree with nodes to not be empty")
	}
}

func TestBinarySearchTree_Clear(t *testing.T) {
	bst := NewBinarySearchTree()
	values := []int{50, 30, 70, 20, 40, 60, 80}
	
	// Insert values
	for _, value := range values {
		bst.Insert(value)
	}
	
	// Verify tree is not empty
	if bst.IsEmpty() {
		t.Errorf("Expected tree to not be empty before clear")
	}
	
	// Clear tree
	bst.Clear()
	
	// Verify tree is empty
	if !bst.IsEmpty() {
		t.Errorf("Expected tree to be empty after clear")
	}
	if bst.Size() != 0 {
		t.Errorf("Expected size to be 0 after clear, got %d", bst.Size())
	}
	if bst.Root != nil {
		t.Errorf("Expected root to be nil after clear")
	}
}

func TestBinarySearchTree_String(t *testing.T) {
	bst := NewBinarySearchTree()
	
	// Test empty tree string representation
	emptyStr := bst.String()
	if emptyStr != "Empty BST" {
		t.Errorf("Expected 'Empty BST', got '%s'", emptyStr)
	}
	
	// Test non-empty tree string representation
	bst.Insert(50)
	bst.Insert(30)
	bst.Insert(70)
	
	str := bst.String()
	if str == "" {
		t.Errorf("Expected non-empty string representation")
	}
}

// Benchmark tests
func BenchmarkBinarySearchTree_Insert(b *testing.B) {
	bst := NewBinarySearchTree()
	for i := 0; i < b.N; i++ {
		bst.Insert(i)
	}
}

func BenchmarkBinarySearchTree_Search(b *testing.B) {
	bst := NewBinarySearchTree()
	// Insert 1000 values
	for i := 0; i < 1000; i++ {
		bst.Insert(i)
	}
	
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		bst.Search(i % 1000)
	}
}

func BenchmarkBinarySearchTree_Delete(b *testing.B) {
	bst := NewBinarySearchTree()
	// Insert 1000 values
	for i := 0; i < 1000; i++ {
		bst.Insert(i)
	}
	
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		bst.Delete(i % 1000)
	}
}
