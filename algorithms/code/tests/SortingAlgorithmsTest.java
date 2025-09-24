import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import static org.junit.jupiter.api.Assertions.*;

import java.util.Arrays;
import java.util.Map;

/**
 * Comprehensive test suite for SortingAlgorithms implementation
 */
public class SortingAlgorithmsTest {
    
    private SortingAlgorithms sa;
    
    @BeforeEach
    void setUp() {
        sa = new SortingAlgorithms();
    }
    
    @Test
    @DisplayName("Test Bubble Sort with unsorted array")
    void testBubbleSortUnsorted() {
        int[] arr = {64, 34, 25, 12, 22, 11, 90};
        SortingAlgorithms.SortingStats stats = sa.bubbleSort(arr);
        
        assertTrue(sa.isSorted(arr), "Bubble sort should sort the array");
        assertTrue(stats.comparisons > 0, "Should have comparisons > 0");
        assertTrue(stats.timeElapsed > 0, "Should have time elapsed > 0");
    }
    
    @Test
    @DisplayName("Test Bubble Sort with already sorted array")
    void testBubbleSortSorted() {
        int[] arr = {1, 2, 3, 4, 5};
        SortingAlgorithms.SortingStats stats = sa.bubbleSort(arr);
        
        assertTrue(sa.isSorted(arr), "Bubble sort should maintain sorted array");
        assertArrayEquals(new int[]{1, 2, 3, 4, 5}, arr, "Array should remain unchanged");
    }
    
    @Test
    @DisplayName("Test Bubble Sort with single element")
    void testBubbleSortSingleElement() {
        int[] arr = {42};
        SortingAlgorithms.SortingStats stats = sa.bubbleSort(arr);
        
        assertTrue(sa.isSorted(arr), "Single element should be considered sorted");
        assertEquals(1, arr.length, "Array length should remain 1");
    }
    
    @Test
    @DisplayName("Test Bubble Sort with empty array")
    void testBubbleSortEmpty() {
        int[] arr = {};
        SortingAlgorithms.SortingStats stats = sa.bubbleSort(arr);
        
        assertTrue(sa.isSorted(arr), "Empty array should be considered sorted");
        assertEquals(0, arr.length, "Array length should remain 0");
    }
    
    @Test
    @DisplayName("Test Selection Sort")
    void testSelectionSort() {
        int[] arr = {64, 34, 25, 12, 22, 11, 90};
        SortingAlgorithms.SortingStats stats = sa.selectionSort(arr);
        
        assertTrue(sa.isSorted(arr), "Selection sort should sort the array");
        assertTrue(stats.comparisons > 0, "Should have comparisons > 0");
        
        // Test with reverse sorted array
        int[] reverseArr = {5, 4, 3, 2, 1};
        sa.selectionSort(reverseArr);
        assertTrue(sa.isSorted(reverseArr), "Selection sort should sort reverse array");
    }
    
    @Test
    @DisplayName("Test Insertion Sort")
    void testInsertionSort() {
        int[] arr = {64, 34, 25, 12, 22, 11, 90};
        SortingAlgorithms.SortingStats stats = sa.insertionSort(arr);
        
        assertTrue(sa.isSorted(arr), "Insertion sort should sort the array");
        assertTrue(stats.comparisons > 0, "Should have comparisons > 0");
        
        // Test with already sorted array (should be efficient)
        int[] sortedArr = {1, 2, 3, 4, 5};
        SortingAlgorithms.SortingStats stats2 = sa.insertionSort(sortedArr);
        assertTrue(sa.isSorted(sortedArr), "Insertion sort should maintain sorted array");
    }
    
    @Test
    @DisplayName("Test Merge Sort")
    void testMergeSort() {
        int[] arr = {64, 34, 25, 12, 22, 11, 90};
        SortingAlgorithms.SortingStats stats = sa.mergeSort(arr);
        
        assertTrue(sa.isSorted(arr), "Merge sort should sort the array");
        assertTrue(stats.comparisons > 0, "Should have comparisons > 0");
        
        // Test with large array
        int[] largeArr = sa.generateRandomArray(1000);
        sa.mergeSort(largeArr);
        assertTrue(sa.isSorted(largeArr), "Merge sort should sort large array");
    }
    
    @Test
    @DisplayName("Test Quick Sort")
    void testQuickSort() {
        int[] arr = {64, 34, 25, 12, 22, 11, 90};
        SortingAlgorithms.SortingStats stats = sa.quickSort(arr);
        
        assertTrue(sa.isSorted(arr), "Quick sort should sort the array");
        assertTrue(stats.comparisons > 0, "Should have comparisons > 0");
        
        // Test with duplicate values
        int[] duplicateArr = {3, 1, 3, 2, 1, 2, 3};
        sa.quickSort(duplicateArr);
        assertTrue(sa.isSorted(duplicateArr), "Quick sort should handle duplicates");
    }
    
    @Test
    @DisplayName("Test Heap Sort")
    void testHeapSort() {
        int[] arr = {64, 34, 25, 12, 22, 11, 90};
        SortingAlgorithms.SortingStats stats = sa.heapSort(arr);
        
        assertTrue(sa.isSorted(arr), "Heap sort should sort the array");
        assertTrue(stats.comparisons > 0, "Should have comparisons > 0");
        
        // Test with negative numbers
        int[] negativeArr = {-5, 3, -1, 0, 2, -3, 1};
        sa.heapSort(negativeArr);
        assertTrue(sa.isSorted(negativeArr), "Heap sort should handle negative numbers");
    }
    
    @Test
    @DisplayName("Test isSorted method")
    void testIsSorted() {
        // Test sorted array
        int[] sortedArr = {1, 2, 3, 4, 5};
        assertTrue(sa.isSorted(sortedArr), "Sorted array should be identified as sorted");
        
        // Test unsorted array
        int[] unsortedArr = {5, 2, 8, 1, 9};
        assertFalse(sa.isSorted(unsortedArr), "Unsorted array should be identified as unsorted");
        
        // Test empty array
        int[] emptyArr = {};
        assertTrue(sa.isSorted(emptyArr), "Empty array should be considered sorted");
        
        // Test single element
        int[] singleArr = {42};
        assertTrue(sa.isSorted(singleArr), "Single element should be considered sorted");
    }
    
    @Test
    @DisplayName("Test array generation methods")
    void testArrayGeneration() {
        // Test random array generation
        int[] randomArr = sa.generateRandomArray(100);
        assertEquals(100, randomArr.length, "Random array should have correct length");
        
        // Test sorted array generation
        int[] sortedArr = sa.generateSortedArray(50);
        assertEquals(50, sortedArr.length, "Sorted array should have correct length");
        assertTrue(sa.isSorted(sortedArr), "Generated sorted array should be sorted");
        
        // Test reverse sorted array generation
        int[] reverseArr = sa.generateReverseSortedArray(25);
        assertEquals(25, reverseArr.length, "Reverse sorted array should have correct length");
        
        // Verify reverse sorted property
        for (int i = 1; i < reverseArr.length; i++) {
            assertTrue(reverseArr[i] <= reverseArr[i-1], 
                      "Generated reverse sorted array should be reverse sorted");
        }
    }
    
    @Test
    @DisplayName("Test algorithm comparison")
    void testCompareAlgorithms() {
        int[] arr = {64, 34, 25, 12, 22, 11, 90};
        Map<String, SortingAlgorithms.SortingStats> results = sa.compareAlgorithms(arr);
        
        // Verify all algorithms are present
        String[] expectedAlgorithms = {"Bubble Sort", "Selection Sort", "Insertion Sort", 
                                     "Merge Sort", "Quick Sort", "Heap Sort"};
        for (String algorithm : expectedAlgorithms) {
            assertTrue(results.containsKey(algorithm), 
                      "Algorithm " + algorithm + " should be in comparison results");
        }
        
        // Verify all results have valid statistics
        for (Map.Entry<String, SortingAlgorithms.SortingStats> entry : results.entrySet()) {
            assertTrue(entry.getValue().comparisons > 0, 
                      "Algorithm " + entry.getKey() + " should have comparisons > 0");
            assertTrue(entry.getValue().timeElapsed > 0, 
                      "Algorithm " + entry.getKey() + " should have time elapsed > 0");
        }
    }
    
    @Test
    @DisplayName("Test algorithm consistency")
    void testAlgorithmConsistency() {
        int[] originalArr = {64, 34, 25, 12, 22, 11, 90, 5, 77, 30};
        int[] expected = {5, 11, 12, 22, 25, 30, 34, 64, 77, 90};
        
        // Test each algorithm produces the same result
        int[] arr1 = Arrays.copyOf(originalArr, originalArr.length);
        int[] arr2 = Arrays.copyOf(originalArr, originalArr.length);
        int[] arr3 = Arrays.copyOf(originalArr, originalArr.length);
        int[] arr4 = Arrays.copyOf(originalArr, originalArr.length);
        int[] arr5 = Arrays.copyOf(originalArr, originalArr.length);
        int[] arr6 = Arrays.copyOf(originalArr, originalArr.length);
        
        sa.bubbleSort(arr1);
        sa.selectionSort(arr2);
        sa.insertionSort(arr3);
        sa.mergeSort(arr4);
        sa.quickSort(arr5);
        sa.heapSort(arr6);
        
        assertArrayEquals(expected, arr1, "Bubble sort should produce correct result");
        assertArrayEquals(expected, arr2, "Selection sort should produce correct result");
        assertArrayEquals(expected, arr3, "Insertion sort should produce correct result");
        assertArrayEquals(expected, arr4, "Merge sort should produce correct result");
        assertArrayEquals(expected, arr5, "Quick sort should produce correct result");
        assertArrayEquals(expected, arr6, "Heap sort should produce correct result");
    }
    
    @Test
    @DisplayName("Test edge cases")
    void testEdgeCases() {
        // Test with all same elements
        int[] sameElements = {5, 5, 5, 5, 5};
        sa.bubbleSort(sameElements);
        assertTrue(sa.isSorted(sameElements), "Should handle array with same elements");
        
        // Test with two elements
        int[] twoElements = {3, 1};
        sa.quickSort(twoElements);
        assertTrue(sa.isSorted(twoElements), "Should handle array with two elements");
        assertArrayEquals(new int[]{1, 3}, twoElements, "Two elements should be sorted correctly");
        
        // Test with negative numbers
        int[] negativeNumbers = {-5, -1, -3, -2, -4};
        sa.heapSort(negativeNumbers);
        assertTrue(sa.isSorted(negativeNumbers), "Should handle negative numbers");
    }
    
    @Test
    @DisplayName("Test performance characteristics")
    void testPerformanceCharacteristics() {
        // Test that O(n log n) algorithms are generally faster than O(n²) on large arrays
        int[] largeArr = sa.generateRandomArray(1000);
        
        SortingAlgorithms.SortingStats bubbleStats = sa.bubbleSort(largeArr);
        SortingAlgorithms.SortingStats mergeStats = sa.mergeSort(largeArr);
        SortingAlgorithms.SortingStats quickStats = sa.quickSort(largeArr);
        
        // O(n²) algorithms should have more comparisons than O(n log n) algorithms
        assertTrue(bubbleStats.comparisons > mergeStats.comparisons, 
                  "Bubble sort should have more comparisons than merge sort on large array");
        assertTrue(bubbleStats.comparisons > quickStats.comparisons, 
                  "Bubble sort should have more comparisons than quick sort on large array");
    }
    
    @Test
    @DisplayName("Test stability (where applicable)")
    void testStability() {
        // Note: Only insertion sort and merge sort are stable among our implementations
        // Test with array containing duplicate values
        int[] arr = {3, 1, 3, 2, 1, 2, 3};
        
        // For stable sorts, the relative order of equal elements should be preserved
        // This is a simplified test - in practice, you'd need to track original positions
        sa.insertionSort(arr);
        assertTrue(sa.isSorted(arr), "Insertion sort should maintain stability");
        
        int[] arr2 = {3, 1, 3, 2, 1, 2, 3};
        sa.mergeSort(arr2);
        assertTrue(sa.isSorted(arr2), "Merge sort should maintain stability");
    }
}
