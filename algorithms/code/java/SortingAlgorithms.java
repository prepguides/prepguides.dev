import java.util.*;

/**
 * Comprehensive implementation of various sorting algorithms in Java
 * Includes performance statistics and comparison capabilities
 */
public class SortingAlgorithms {
    
    /**
     * SortingStats holds statistics for sorting operations
     */
    public static class SortingStats {
        public int comparisons;
        public int swaps;
        public long timeElapsed; // in nanoseconds
        
        public SortingStats() {
            this.comparisons = 0;
            this.swaps = 0;
            this.timeElapsed = 0;
        }
        
        @Override
        public String toString() {
            return String.format("Comparisons=%d, Swaps=%d, Time=%d ns", 
                               comparisons, swaps, timeElapsed);
        }
    }
    
    /**
     * Bubble Sort implementation
     * Time Complexity: O(n²) worst case, O(n) best case
     * Space Complexity: O(1)
     */
    public SortingStats bubbleSort(int[] arr) {
        SortingStats stats = new SortingStats();
        long startTime = System.nanoTime();
        
        int n = arr.length;
        int[] arrCopy = Arrays.copyOf(arr, arr.length);
        
        for (int i = 0; i < n - 1; i++) {
            boolean swapped = false;
            for (int j = 0; j < n - i - 1; j++) {
                stats.comparisons++;
                if (arrCopy[j] > arrCopy[j + 1]) {
                    swap(arrCopy, j, j + 1);
                    stats.swaps++;
                    swapped = true;
                }
            }
            if (!swapped) {
                break; // Early termination if no swaps occurred
            }
        }
        
        stats.timeElapsed = System.nanoTime() - startTime;
        return stats;
    }
    
    /**
     * Selection Sort implementation
     * Time Complexity: O(n²) in all cases
     * Space Complexity: O(1)
     */
    public SortingStats selectionSort(int[] arr) {
        SortingStats stats = new SortingStats();
        long startTime = System.nanoTime();
        
        int n = arr.length;
        int[] arrCopy = Arrays.copyOf(arr, arr.length);
        
        for (int i = 0; i < n - 1; i++) {
            int minIdx = i;
            for (int j = i + 1; j < n; j++) {
                stats.comparisons++;
                if (arrCopy[j] < arrCopy[minIdx]) {
                    minIdx = j;
                }
            }
            if (minIdx != i) {
                swap(arrCopy, i, minIdx);
                stats.swaps++;
            }
        }
        
        stats.timeElapsed = System.nanoTime() - startTime;
        return stats;
    }
    
    /**
     * Insertion Sort implementation
     * Time Complexity: O(n²) worst case, O(n) best case
     * Space Complexity: O(1)
     */
    public SortingStats insertionSort(int[] arr) {
        SortingStats stats = new SortingStats();
        long startTime = System.nanoTime();
        
        int n = arr.length;
        int[] arrCopy = Arrays.copyOf(arr, arr.length);
        
        for (int i = 1; i < n; i++) {
            int key = arrCopy[i];
            int j = i - 1;
            
            while (j >= 0) {
                stats.comparisons++;
                if (arrCopy[j] > key) {
                    arrCopy[j + 1] = arrCopy[j];
                    stats.swaps++;
                    j--;
                } else {
                    break;
                }
            }
            arrCopy[j + 1] = key;
        }
        
        stats.timeElapsed = System.nanoTime() - startTime;
        return stats;
    }
    
    /**
     * Merge Sort implementation
     * Time Complexity: O(n log n) in all cases
     * Space Complexity: O(n)
     */
    public SortingStats mergeSort(int[] arr) {
        SortingStats stats = new SortingStats();
        long startTime = System.nanoTime();
        
        int[] arrCopy = Arrays.copyOf(arr, arr.length);
        mergeSortHelper(arrCopy, 0, arrCopy.length - 1, stats);
        
        stats.timeElapsed = System.nanoTime() - startTime;
        return stats;
    }
    
    /**
     * Helper method for merge sort
     */
    private void mergeSortHelper(int[] arr, int left, int right, SortingStats stats) {
        if (left < right) {
            int mid = left + (right - left) / 2;
            mergeSortHelper(arr, left, mid, stats);
            mergeSortHelper(arr, mid + 1, right, stats);
            merge(arr, left, mid, right, stats);
        }
    }
    
    /**
     * Merge two sorted subarrays
     */
    private void merge(int[] arr, int left, int mid, int right, SortingStats stats) {
        int n1 = mid - left + 1;
        int n2 = right - mid;
        
        int[] leftArr = new int[n1];
        int[] rightArr = new int[n2];
        
        for (int i = 0; i < n1; i++) {
            leftArr[i] = arr[left + i];
        }
        for (int j = 0; j < n2; j++) {
            rightArr[j] = arr[mid + 1 + j];
        }
        
        int i = 0, j = 0, k = left;
        
        while (i < n1 && j < n2) {
            stats.comparisons++;
            if (leftArr[i] <= rightArr[j]) {
                arr[k] = leftArr[i];
                i++;
            } else {
                arr[k] = rightArr[j];
                j++;
            }
            k++;
        }
        
        while (i < n1) {
            arr[k] = leftArr[i];
            i++;
            k++;
        }
        
        while (j < n2) {
            arr[k] = rightArr[j];
            j++;
            k++;
        }
    }
    
    /**
     * Quick Sort implementation
     * Time Complexity: O(n log n) average case, O(n²) worst case
     * Space Complexity: O(log n) average case, O(n) worst case
     */
    public SortingStats quickSort(int[] arr) {
        SortingStats stats = new SortingStats();
        long startTime = System.nanoTime();
        
        int[] arrCopy = Arrays.copyOf(arr, arr.length);
        quickSortHelper(arrCopy, 0, arrCopy.length - 1, stats);
        
        stats.timeElapsed = System.nanoTime() - startTime;
        return stats;
    }
    
    /**
     * Helper method for quick sort
     */
    private void quickSortHelper(int[] arr, int low, int high, SortingStats stats) {
        if (low < high) {
            int pi = partition(arr, low, high, stats);
            quickSortHelper(arr, low, pi - 1, stats);
            quickSortHelper(arr, pi + 1, high, stats);
        }
    }
    
    /**
     * Partition the array for quick sort
     */
    private int partition(int[] arr, int low, int high, SortingStats stats) {
        int pivot = arr[high];
        int i = low - 1;
        
        for (int j = low; j < high; j++) {
            stats.comparisons++;
            if (arr[j] < pivot) {
                i++;
                swap(arr, i, j);
                stats.swaps++;
            }
        }
        
        swap(arr, i + 1, high);
        stats.swaps++;
        return i + 1;
    }
    
    /**
     * Heap Sort implementation
     * Time Complexity: O(n log n) in all cases
     * Space Complexity: O(1)
     */
    public SortingStats heapSort(int[] arr) {
        SortingStats stats = new SortingStats();
        long startTime = System.nanoTime();
        
        int n = arr.length;
        int[] arrCopy = Arrays.copyOf(arr, arr.length);
        
        // Build max heap
        for (int i = n / 2 - 1; i >= 0; i--) {
            heapify(arrCopy, n, i, stats);
        }
        
        // Extract elements from heap one by one
        for (int i = n - 1; i > 0; i--) {
            swap(arrCopy, 0, i);
            stats.swaps++;
            heapify(arrCopy, i, 0, stats);
        }
        
        stats.timeElapsed = System.nanoTime() - startTime;
        return stats;
    }
    
    /**
     * Maintain the heap property
     */
    private void heapify(int[] arr, int n, int i, SortingStats stats) {
        int largest = i;
        int left = 2 * i + 1;
        int right = 2 * i + 2;
        
        if (left < n) {
            stats.comparisons++;
            if (arr[left] > arr[largest]) {
                largest = left;
            }
        }
        
        if (right < n) {
            stats.comparisons++;
            if (arr[right] > arr[largest]) {
                largest = right;
            }
        }
        
        if (largest != i) {
            swap(arr, i, largest);
            stats.swaps++;
            heapify(arr, n, largest, stats);
        }
    }
    
    /**
     * Utility method to swap two elements in an array
     */
    private void swap(int[] arr, int i, int j) {
        int temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    
    /**
     * Generate a random array of specified size
     */
    public int[] generateRandomArray(int size) {
        Random random = new Random();
        int[] arr = new int[size];
        for (int i = 0; i < size; i++) {
            arr[i] = random.nextInt(1000) + 1;
        }
        return arr;
    }
    
    /**
     * Generate a sorted array of specified size
     */
    public int[] generateSortedArray(int size) {
        int[] arr = new int[size];
        for (int i = 0; i < size; i++) {
            arr[i] = i + 1;
        }
        return arr;
    }
    
    /**
     * Generate a reverse sorted array of specified size
     */
    public int[] generateReverseSortedArray(int size) {
        int[] arr = new int[size];
        for (int i = 0; i < size; i++) {
            arr[i] = size - i;
        }
        return arr;
    }
    
    /**
     * Check if an array is sorted
     */
    public boolean isSorted(int[] arr) {
        for (int i = 1; i < arr.length; i++) {
            if (arr[i] < arr[i - 1]) {
                return false;
            }
        }
        return true;
    }
    
    /**
     * Compare all sorting algorithms on the same data
     */
    public Map<String, SortingStats> compareAlgorithms(int[] arr) {
        Map<String, SortingStats> results = new HashMap<>();
        
        results.put("Bubble Sort", bubbleSort(arr));
        results.put("Selection Sort", selectionSort(arr));
        results.put("Insertion Sort", insertionSort(arr));
        results.put("Merge Sort", mergeSort(arr));
        results.put("Quick Sort", quickSort(arr));
        results.put("Heap Sort", heapSort(arr));
        
        return results;
    }
    
    /**
     * Print sorting statistics in a formatted way
     */
    public void printStats(String algorithm, SortingStats stats) {
        System.out.printf("%-15s: %s%n", algorithm, stats.toString());
    }
    
    /**
     * Main method for demonstration
     */
    public static void main(String[] args) {
        SortingAlgorithms sa = new SortingAlgorithms();
        
        // Test with different array sizes and types
        List<TestCase> testCases = Arrays.asList(
            new TestCase("Small Random", sa.generateRandomArray(10)),
            new TestCase("Medium Random", sa.generateRandomArray(100)),
            new TestCase("Large Random", sa.generateRandomArray(1000)),
            new TestCase("Sorted Array", sa.generateSortedArray(100)),
            new TestCase("Reverse Sorted", sa.generateReverseSortedArray(100))
        );
        
        for (TestCase tc : testCases) {
            System.out.printf("%n=== %s (Size: %d) ===%n", tc.name, tc.arr.length);
            
            Map<String, SortingStats> results = sa.compareAlgorithms(tc.arr);
            
            for (Map.Entry<String, SortingStats> entry : results.entrySet()) {
                sa.printStats(entry.getKey(), entry.getValue());
            }
        }
        
        // Demonstrate individual algorithm
        System.out.println("\n=== Individual Algorithm Demo ===");
        int[] testArr = {64, 34, 25, 12, 22, 11, 90};
        System.out.println("Original array: " + Arrays.toString(testArr));
        
        SortingStats stats = sa.quickSort(testArr);
        System.out.println("After Quick Sort: " + Arrays.toString(testArr));
        sa.printStats("Quick Sort", stats);
        System.out.println("Is sorted: " + sa.isSorted(testArr));
    }
    
    /**
     * Helper class for test cases
     */
    private static class TestCase {
        String name;
        int[] arr;
        
        TestCase(String name, int[] arr) {
            this.name = name;
            this.arr = arr;
        }
    }
}
