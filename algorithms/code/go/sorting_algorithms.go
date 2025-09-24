package main

import (
	"fmt"
	"math/rand"
	"time"
)

// SortingStats holds statistics for sorting operations
type SortingStats struct {
	Comparisons int
	Swaps       int
	TimeElapsed time.Duration
}

// SortingAlgorithms provides various sorting algorithm implementations
type SortingAlgorithms struct{}

// NewSortingAlgorithms creates a new instance
func NewSortingAlgorithms() *SortingAlgorithms {
	return &SortingAlgorithms{}
}

// BubbleSort implements bubble sort algorithm
func (sa *SortingAlgorithms) BubbleSort(arr []int) SortingStats {
	stats := SortingStats{}
	start := time.Now()
	
	n := len(arr)
	arrCopy := make([]int, n)
	copy(arrCopy, arr)
	
	for i := 0; i < n-1; i++ {
		swapped := false
		for j := 0; j < n-i-1; j++ {
			stats.Comparisons++
			if arrCopy[j] > arrCopy[j+1] {
				arrCopy[j], arrCopy[j+1] = arrCopy[j+1], arrCopy[j]
				stats.Swaps++
				swapped = true
			}
		}
		if !swapped {
			break // Early termination if no swaps occurred
		}
	}
	
	stats.TimeElapsed = time.Since(start)
	return stats
}

// SelectionSort implements selection sort algorithm
func (sa *SortingAlgorithms) SelectionSort(arr []int) SortingStats {
	stats := SortingStats{}
	start := time.Now()
	
	n := len(arr)
	arrCopy := make([]int, n)
	copy(arrCopy, arr)
	
	for i := 0; i < n-1; i++ {
		minIdx := i
		for j := i + 1; j < n; j++ {
			stats.Comparisons++
			if arrCopy[j] < arrCopy[minIdx] {
				minIdx = j
			}
		}
		if minIdx != i {
			arrCopy[i], arrCopy[minIdx] = arrCopy[minIdx], arrCopy[i]
			stats.Swaps++
		}
	}
	
	stats.TimeElapsed = time.Since(start)
	return stats
}

// InsertionSort implements insertion sort algorithm
func (sa *SortingAlgorithms) InsertionSort(arr []int) SortingStats {
	stats := SortingStats{}
	start := time.Now()
	
	n := len(arr)
	arrCopy := make([]int, n)
	copy(arrCopy, arr)
	
	for i := 1; i < n; i++ {
		key := arrCopy[i]
		j := i - 1
		
		for j >= 0 {
			stats.Comparisons++
			if arrCopy[j] > key {
				arrCopy[j+1] = arrCopy[j]
				stats.Swaps++
				j--
			} else {
				break
			}
		}
		arrCopy[j+1] = key
	}
	
	stats.TimeElapsed = time.Since(start)
	return stats
}

// MergeSort implements merge sort algorithm
func (sa *SortingAlgorithms) MergeSort(arr []int) SortingStats {
	stats := SortingStats{}
	start := time.Now()
	
	arrCopy := make([]int, len(arr))
	copy(arrCopy, arr)
	
	sa.mergeSortHelper(arrCopy, 0, len(arrCopy)-1, &stats)
	
	stats.TimeElapsed = time.Since(start)
	return stats
}

// mergeSortHelper is a helper function for merge sort
func (sa *SortingAlgorithms) mergeSortHelper(arr []int, left, right int, stats *SortingStats) {
	if left < right {
		mid := left + (right-left)/2
		sa.mergeSortHelper(arr, left, mid, stats)
		sa.mergeSortHelper(arr, mid+1, right, stats)
		sa.merge(arr, left, mid, right, stats)
	}
}

// merge merges two sorted subarrays
func (sa *SortingAlgorithms) merge(arr []int, left, mid, right int, stats *SortingStats) {
	n1 := mid - left + 1
	n2 := right - mid
	
	leftArr := make([]int, n1)
	rightArr := make([]int, n2)
	
	for i := 0; i < n1; i++ {
		leftArr[i] = arr[left+i]
	}
	for j := 0; j < n2; j++ {
		rightArr[j] = arr[mid+1+j]
	}
	
	i, j, k := 0, 0, left
	
	for i < n1 && j < n2 {
		stats.Comparisons++
		if leftArr[i] <= rightArr[j] {
			arr[k] = leftArr[i]
			i++
		} else {
			arr[k] = rightArr[j]
			j++
		}
		k++
	}
	
	for i < n1 {
		arr[k] = leftArr[i]
		i++
		k++
	}
	
	for j < n2 {
		arr[k] = rightArr[j]
		j++
		k++
	}
}

// QuickSort implements quick sort algorithm
func (sa *SortingAlgorithms) QuickSort(arr []int) SortingStats {
	stats := SortingStats{}
	start := time.Now()
	
	arrCopy := make([]int, len(arr))
	copy(arrCopy, arr)
	
	sa.quickSortHelper(arrCopy, 0, len(arrCopy)-1, &stats)
	
	stats.TimeElapsed = time.Since(start)
	return stats
}

// quickSortHelper is a helper function for quick sort
func (sa *SortingAlgorithms) quickSortHelper(arr []int, low, high int, stats *SortingStats) {
	if low < high {
		pi := sa.partition(arr, low, high, stats)
		sa.quickSortHelper(arr, low, pi-1, stats)
		sa.quickSortHelper(arr, pi+1, high, stats)
	}
}

// partition partitions the array for quick sort
func (sa *SortingAlgorithms) partition(arr []int, low, high int, stats *SortingStats) int {
	pivot := arr[high]
	i := low - 1
	
	for j := low; j < high; j++ {
		stats.Comparisons++
		if arr[j] < pivot {
			i++
			arr[i], arr[j] = arr[j], arr[i]
			stats.Swaps++
		}
	}
	
	arr[i+1], arr[high] = arr[high], arr[i+1]
	stats.Swaps++
	return i + 1
}

// HeapSort implements heap sort algorithm
func (sa *SortingAlgorithms) HeapSort(arr []int) SortingStats {
	stats := SortingStats{}
	start := time.Now()
	
	arrCopy := make([]int, len(arr))
	copy(arrCopy, arr)
	
	n := len(arrCopy)
	
	// Build max heap
	for i := n/2 - 1; i >= 0; i-- {
		sa.heapify(arrCopy, n, i, &stats)
	}
	
	// Extract elements from heap one by one
	for i := n - 1; i > 0; i-- {
		arrCopy[0], arrCopy[i] = arrCopy[i], arrCopy[0]
		stats.Swaps++
		sa.heapify(arrCopy, i, 0, &stats)
	}
	
	stats.TimeElapsed = time.Since(start)
	return stats
}

// heapify maintains the heap property
func (sa *SortingAlgorithms) heapify(arr []int, n, i int, stats *SortingStats) {
	largest := i
	left := 2*i + 1
	right := 2*i + 2
	
	if left < n {
		stats.Comparisons++
		if arr[left] > arr[largest] {
			largest = left
		}
	}
	
	if right < n {
		stats.Comparisons++
		if arr[right] > arr[largest] {
			largest = right
		}
	}
	
	if largest != i {
		arr[i], arr[largest] = arr[largest], arr[i]
		stats.Swaps++
		sa.heapify(arr, n, largest, stats)
	}
}

// GenerateRandomArray creates a random array of specified size
func (sa *SortingAlgorithms) GenerateRandomArray(size int) []int {
	arr := make([]int, size)
	for i := 0; i < size; i++ {
		arr[i] = rand.Intn(1000) + 1
	}
	return arr
}

// GenerateSortedArray creates a sorted array of specified size
func (sa *SortingAlgorithms) GenerateSortedArray(size int) []int {
	arr := make([]int, size)
	for i := 0; i < size; i++ {
		arr[i] = i + 1
	}
	return arr
}

// GenerateReverseSortedArray creates a reverse sorted array of specified size
func (sa *SortingAlgorithms) GenerateReverseSortedArray(size int) []int {
	arr := make([]int, size)
	for i := 0; i < size; i++ {
		arr[i] = size - i
	}
	return arr
}

// IsSorted checks if an array is sorted
func (sa *SortingAlgorithms) IsSorted(arr []int) bool {
	for i := 1; i < len(arr); i++ {
		if arr[i] < arr[i-1] {
			return false
		}
	}
	return true
}

// CompareAlgorithms compares all sorting algorithms on the same data
func (sa *SortingAlgorithms) CompareAlgorithms(arr []int) map[string]SortingStats {
	results := make(map[string]SortingStats)
	
	results["Bubble Sort"] = sa.BubbleSort(arr)
	results["Selection Sort"] = sa.SelectionSort(arr)
	results["Insertion Sort"] = sa.InsertionSort(arr)
	results["Merge Sort"] = sa.MergeSort(arr)
	results["Quick Sort"] = sa.QuickSort(arr)
	results["Heap Sort"] = sa.HeapSort(arr)
	
	return results
}

// PrintStats prints sorting statistics in a formatted way
func (sa *SortingAlgorithms) PrintStats(algorithm string, stats SortingStats) {
	fmt.Printf("%-15s: Comparisons=%d, Swaps=%d, Time=%v\n",
		algorithm, stats.Comparisons, stats.Swaps, stats.TimeElapsed)
}

// Example usage and demonstration
func main() {
	// Seed random number generator
	rand.Seed(time.Now().UnixNano())
	
	sa := NewSortingAlgorithms()
	
	// Test with different array sizes and types
	testCases := []struct {
		name string
		arr  []int
	}{
		{"Small Random", sa.GenerateRandomArray(10)},
		{"Medium Random", sa.GenerateRandomArray(100)},
		{"Large Random", sa.GenerateRandomArray(1000)},
		{"Sorted Array", sa.GenerateSortedArray(100)},
		{"Reverse Sorted", sa.GenerateReverseSortedArray(100)},
	}
	
	for _, tc := range testCases {
		fmt.Printf("\n=== %s (Size: %d) ===\n", tc.name, len(tc.arr))
		
		results := sa.CompareAlgorithms(tc.arr)
		
		for algorithm, stats := range results {
			sa.PrintStats(algorithm, stats)
		}
	}
	
	// Demonstrate individual algorithm
	fmt.Println("\n=== Individual Algorithm Demo ===")
	testArr := []int{64, 34, 25, 12, 22, 11, 90}
	fmt.Printf("Original array: %v\n", testArr)
	
	stats := sa.QuickSort(testArr)
	fmt.Printf("After Quick Sort: %v\n", testArr)
	sa.PrintStats("Quick Sort", stats)
	fmt.Printf("Is sorted: %t\n", sa.IsSorted(testArr))
}
