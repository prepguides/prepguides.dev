package main

import (
	"reflect"
	"testing"
)

func TestSortingAlgorithms_BubbleSort(t *testing.T) {
	sa := NewSortingAlgorithms()
	
	// Test with unsorted array
	arr := []int{64, 34, 25, 12, 22, 11, 90}
	stats := sa.BubbleSort(arr)
	
	// Verify array is sorted
	if !sa.IsSorted(arr) {
		t.Errorf("Bubble sort failed to sort array: %v", arr)
	}
	
	// Verify statistics are reasonable
	if stats.Comparisons == 0 {
		t.Errorf("Expected comparisons > 0, got %d", stats.Comparisons)
	}
	if stats.TimeElapsed == 0 {
		t.Errorf("Expected time elapsed > 0, got %v", stats.TimeElapsed)
	}
	
	// Test with already sorted array
	sortedArr := []int{1, 2, 3, 4, 5}
	stats2 := sa.BubbleSort(sortedArr)
	
	if !sa.IsSorted(sortedArr) {
		t.Errorf("Bubble sort failed on sorted array: %v", sortedArr)
	}
	
	// Test with single element
	singleArr := []int{42}
	stats3 := sa.BubbleSort(singleArr)
	
	if !sa.IsSorted(singleArr) {
		t.Errorf("Bubble sort failed on single element: %v", singleArr)
	}
	
	// Test with empty array
	emptyArr := []int{}
	stats4 := sa.BubbleSort(emptyArr)
	
	if !sa.IsSorted(emptyArr) {
		t.Errorf("Bubble sort failed on empty array: %v", emptyArr)
	}
}

func TestSortingAlgorithms_SelectionSort(t *testing.T) {
	sa := NewSortingAlgorithms()
	
	// Test with unsorted array
	arr := []int{64, 34, 25, 12, 22, 11, 90}
	stats := sa.SelectionSort(arr)
	
	// Verify array is sorted
	if !sa.IsSorted(arr) {
		t.Errorf("Selection sort failed to sort array: %v", arr)
	}
	
	// Verify statistics
	if stats.Comparisons == 0 {
		t.Errorf("Expected comparisons > 0, got %d", stats.Comparisons)
	}
	
	// Test with reverse sorted array
	reverseArr := []int{5, 4, 3, 2, 1}
	stats2 := sa.SelectionSort(reverseArr)
	
	if !sa.IsSorted(reverseArr) {
		t.Errorf("Selection sort failed on reverse sorted array: %v", reverseArr)
	}
}

func TestSortingAlgorithms_InsertionSort(t *testing.T) {
	sa := NewSortingAlgorithms()
	
	// Test with unsorted array
	arr := []int{64, 34, 25, 12, 22, 11, 90}
	stats := sa.InsertionSort(arr)
	
	// Verify array is sorted
	if !sa.IsSorted(arr) {
		t.Errorf("Insertion sort failed to sort array: %v", arr)
	}
	
	// Verify statistics
	if stats.Comparisons == 0 {
		t.Errorf("Expected comparisons > 0, got %d", stats.Comparisons)
	}
	
	// Test with already sorted array (should be efficient)
	sortedArr := []int{1, 2, 3, 4, 5}
	stats2 := sa.InsertionSort(sortedArr)
	
	if !sa.IsSorted(sortedArr) {
		t.Errorf("Insertion sort failed on sorted array: %v", sortedArr)
	}
}

func TestSortingAlgorithms_MergeSort(t *testing.T) {
	sa := NewSortingAlgorithms()
	
	// Test with unsorted array
	arr := []int{64, 34, 25, 12, 22, 11, 90}
	stats := sa.MergeSort(arr)
	
	// Verify array is sorted
	if !sa.IsSorted(arr) {
		t.Errorf("Merge sort failed to sort array: %v", arr)
	}
	
	// Verify statistics
	if stats.Comparisons == 0 {
		t.Errorf("Expected comparisons > 0, got %d", stats.Comparisons)
	}
	
	// Test with large array
	largeArr := sa.GenerateRandomArray(1000)
	stats2 := sa.MergeSort(largeArr)
	
	if !sa.IsSorted(largeArr) {
		t.Errorf("Merge sort failed on large array")
	}
}

func TestSortingAlgorithms_QuickSort(t *testing.T) {
	sa := NewSortingAlgorithms()
	
	// Test with unsorted array
	arr := []int{64, 34, 25, 12, 22, 11, 90}
	stats := sa.QuickSort(arr)
	
	// Verify array is sorted
	if !sa.IsSorted(arr) {
		t.Errorf("Quick sort failed to sort array: %v", arr)
	}
	
	// Verify statistics
	if stats.Comparisons == 0 {
		t.Errorf("Expected comparisons > 0, got %d", stats.Comparisons)
	}
	
	// Test with duplicate values
	duplicateArr := []int{3, 1, 3, 2, 1, 2, 3}
	stats2 := sa.QuickSort(duplicateArr)
	
	if !sa.IsSorted(duplicateArr) {
		t.Errorf("Quick sort failed on array with duplicates: %v", duplicateArr)
	}
}

func TestSortingAlgorithms_HeapSort(t *testing.T) {
	sa := NewSortingAlgorithms()
	
	// Test with unsorted array
	arr := []int{64, 34, 25, 12, 22, 11, 90}
	stats := sa.HeapSort(arr)
	
	// Verify array is sorted
	if !sa.IsSorted(arr) {
		t.Errorf("Heap sort failed to sort array: %v", arr)
	}
	
	// Verify statistics
	if stats.Comparisons == 0 {
		t.Errorf("Expected comparisons > 0, got %d", stats.Comparisons)
	}
	
	// Test with negative numbers
	negativeArr := []int{-5, 3, -1, 0, 2, -3, 1}
	stats2 := sa.HeapSort(negativeArr)
	
	if !sa.IsSorted(negativeArr) {
		t.Errorf("Heap sort failed on array with negative numbers: %v", negativeArr)
	}
}

func TestSortingAlgorithms_IsSorted(t *testing.T) {
	sa := NewSortingAlgorithms()
	
	// Test sorted array
	sortedArr := []int{1, 2, 3, 4, 5}
	if !sa.IsSorted(sortedArr) {
		t.Errorf("Expected sorted array to be identified as sorted")
	}
	
	// Test unsorted array
	unsortedArr := []int{5, 2, 8, 1, 9}
	if sa.IsSorted(unsortedArr) {
		t.Errorf("Expected unsorted array to be identified as unsorted")
	}
	
	// Test empty array
	emptyArr := []int{}
	if !sa.IsSorted(emptyArr) {
		t.Errorf("Expected empty array to be identified as sorted")
	}
	
	// Test single element
	singleArr := []int{42}
	if !sa.IsSorted(singleArr) {
		t.Errorf("Expected single element array to be identified as sorted")
	}
}

func TestSortingAlgorithms_GenerateArrays(t *testing.T) {
	sa := NewSortingAlgorithms()
	
	// Test random array generation
	randomArr := sa.GenerateRandomArray(100)
	if len(randomArr) != 100 {
		t.Errorf("Expected random array length 100, got %d", len(randomArr))
	}
	
	// Test sorted array generation
	sortedArr := sa.GenerateSortedArray(50)
	if len(sortedArr) != 50 {
		t.Errorf("Expected sorted array length 50, got %d", len(sortedArr))
	}
	if !sa.IsSorted(sortedArr) {
		t.Errorf("Generated sorted array is not sorted: %v", sortedArr)
	}
	
	// Test reverse sorted array generation
	reverseArr := sa.GenerateReverseSortedArray(25)
	if len(reverseArr) != 25 {
		t.Errorf("Expected reverse sorted array length 25, got %d", len(reverseArr))
	}
	
	// Verify reverse sorted property
	for i := 1; i < len(reverseArr); i++ {
		if reverseArr[i] > reverseArr[i-1] {
			t.Errorf("Generated reverse sorted array is not reverse sorted: %v", reverseArr)
			break
		}
	}
}

func TestSortingAlgorithms_CompareAlgorithms(t *testing.T) {
	sa := NewSortingAlgorithms()
	
	// Test with small array
	arr := []int{64, 34, 25, 12, 22, 11, 90}
	results := sa.CompareAlgorithms(arr)
	
	// Verify all algorithms are present
	expectedAlgorithms := []string{"Bubble Sort", "Selection Sort", "Insertion Sort", "Merge Sort", "Quick Sort", "Heap Sort"}
	for _, algorithm := range expectedAlgorithms {
		if _, exists := results[algorithm]; !exists {
			t.Errorf("Expected algorithm %s in comparison results", algorithm)
		}
	}
	
	// Verify all results have valid statistics
	for algorithm, stats := range results {
		if stats.Comparisons == 0 {
			t.Errorf("Algorithm %s has 0 comparisons", algorithm)
		}
		if stats.TimeElapsed == 0 {
			t.Errorf("Algorithm %s has 0 time elapsed", algorithm)
		}
	}
}

func TestSortingAlgorithms_Consistency(t *testing.T) {
	sa := NewSortingAlgorithms()
	
	// Test that all algorithms produce the same sorted result
	arr := []int{64, 34, 25, 12, 22, 11, 90, 5, 77, 30}
	
	// Create copies for each algorithm
	arr1 := make([]int, len(arr))
	arr2 := make([]int, len(arr))
	arr3 := make([]int, len(arr))
	arr4 := make([]int, len(arr))
	arr5 := make([]int, len(arr))
	arr6 := make([]int, len(arr))
	
	copy(arr1, arr)
	copy(arr2, arr)
	copy(arr3, arr)
	copy(arr4, arr)
	copy(arr5, arr)
	copy(arr6, arr)
	
	// Sort with different algorithms
	sa.BubbleSort(arr1)
	sa.SelectionSort(arr2)
	sa.InsertionSort(arr3)
	sa.MergeSort(arr4)
	sa.QuickSort(arr5)
	sa.HeapSort(arr6)
	
	// All should produce the same sorted result
	expected := []int{5, 11, 12, 22, 25, 30, 34, 64, 77, 90}
	
	if !reflect.DeepEqual(arr1, expected) {
		t.Errorf("Bubble sort result mismatch: got %v, expected %v", arr1, expected)
	}
	if !reflect.DeepEqual(arr2, expected) {
		t.Errorf("Selection sort result mismatch: got %v, expected %v", arr2, expected)
	}
	if !reflect.DeepEqual(arr3, expected) {
		t.Errorf("Insertion sort result mismatch: got %v, expected %v", arr3, expected)
	}
	if !reflect.DeepEqual(arr4, expected) {
		t.Errorf("Merge sort result mismatch: got %v, expected %v", arr4, expected)
	}
	if !reflect.DeepEqual(arr5, expected) {
		t.Errorf("Quick sort result mismatch: got %v, expected %v", arr5, expected)
	}
	if !reflect.DeepEqual(arr6, expected) {
		t.Errorf("Heap sort result mismatch: got %v, expected %v", arr6, expected)
	}
}

// Benchmark tests
func BenchmarkBubbleSort(b *testing.B) {
	sa := NewSortingAlgorithms()
	arr := sa.GenerateRandomArray(1000)
	
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		sa.BubbleSort(arr)
	}
}

func BenchmarkSelectionSort(b *testing.B) {
	sa := NewSortingAlgorithms()
	arr := sa.GenerateRandomArray(1000)
	
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		sa.SelectionSort(arr)
	}
}

func BenchmarkInsertionSort(b *testing.B) {
	sa := NewSortingAlgorithms()
	arr := sa.GenerateRandomArray(1000)
	
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		sa.InsertionSort(arr)
	}
}

func BenchmarkMergeSort(b *testing.B) {
	sa := NewSortingAlgorithms()
	arr := sa.GenerateRandomArray(1000)
	
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		sa.MergeSort(arr)
	}
}

func BenchmarkQuickSort(b *testing.B) {
	sa := NewSortingAlgorithms()
	arr := sa.GenerateRandomArray(1000)
	
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		sa.QuickSort(arr)
	}
}

func BenchmarkHeapSort(b *testing.B) {
	sa := NewSortingAlgorithms()
	arr := sa.GenerateRandomArray(1000)
	
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		sa.HeapSort(arr)
	}
}
