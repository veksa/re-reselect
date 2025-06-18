# @veksa/re-reselect

[![npm version](https://img.shields.io/npm/v/@veksa/re-reselect.svg?style=flat-square)](https://www.npmjs.com/package/@veksa/re-reselect)
[![npm downloads](https://img.shields.io/npm/dm/@veksa/re-reselect.svg?style=flat-square)](https://www.npmjs.com/package/@veksa/re-reselect)
[![license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE.md)

`@veksa/re-reselect` is a lightweight wrapper around **[Reselect](https://github.com/veksa/reselect)** that enhances selectors with deeper memoization and sophisticated cache management. This package is a fork of the original `re-reselect` maintained for compatibility with `@veksa/reselect` v5+ and modern TypeScript environments.

Standard `@veksa/reselect` selectors have a cache limit of one, causing cache invalidation when switching between different arguments. `@veksa/re-reselect` solves this by maintaining a cache of selectors, preserving computed values across multiple selector calls with different parameters.

## Features

- **Enhanced memoization** - Retain selector's cache when called with different arguments
- **Selector consolidation** - Join similar selectors into one unified selector
- **Prop sharing** - Share selectors with props across multiple component instances
- **Runtime instantiation** - Create selectors dynamically during runtime
- **Custom caching** - Multiple built-in cache strategies with configurable options
- **TypeScript support** - Full TypeScript type definitions

## Installation

@veksa/re-reselect requires **TypeScript 5.8 or later**.

### Using npm or yarn

```bash
# npm
npm install @veksa/reselect @veksa/re-reselect

# yarn
yarn add @veksa/reselect @veksa/re-reselect
```

## Examples

### Comparing @veksa/reselect and @veksa/re-reselect

Let's compare how we would implement a data selector with both libraries. In this example, we're retrieving user data filtered by a specific criteria and library.

#### Problem: Cache invalidation with multiple parameters

Imagine we need to select users who belong to a particular library and match a given filter. With standard selectors, we would implement this as follows:

#### @veksa/reselect implementation

```typescript
import { createSelector } from '@veksa/reselect';

const getUsers = (state) => state.users;
const getLibraryId = (state, libraryId) => libraryId;
const getFilter = (state, libraryId, filter) => filter;

const getUsersByLibraryAndFilter = createSelector(
  getUsers,
  getLibraryId,
  getFilter,
  (users, libraryId, filter) => {
    console.log('Expensive computation running!');
    return users.filter(user => 
      user.libraryId === libraryId && 
      user.name.includes(filter)
    );
  }
);

// Usage:
const state = { users: [/* ... user data ... */] };

// First call with 'react' library and 'john' filter
const reactUsersJohn = getUsersByLibraryAndFilter(state, 'react', 'john');

// Second call with 'vue' library and 'smith' filter
const vueUsersSmith = getUsersByLibraryAndFilter(state, 'vue', 'smith');

// Third call with 'react' library and 'john' filter again
// Despite having the same parameters as the first call,
// the expensive computation runs again because the second call invalidated the cache
const reactUsersJohnAgain = getUsersByLibraryAndFilter(state, 'react', 'john');
// Console: 'Expensive computation running!' (3 times)
```

With a standard @veksa/reselect selector, **each time** you call it with different arguments, the memoization cache is invalidated. This means that even when you return to previous argument combinations, the expensive computation runs again.

#### @veksa/re-reselect solution

```typescript
import { createCachedSelector } from '@veksa/re-reselect';

const getUsers = (state) => state.users;
const getLibraryId = (state, libraryId) => libraryId;
const getFilter = (state, libraryId, filter) => filter;

const getUsersByLibraryAndFilter = createCachedSelector(
  getUsers,
  getLibraryId,
  getFilter,
  (users, libraryId, filter) => {
    console.log('Expensive computation running!');
    return users.filter(user => 
      user.libraryId === libraryId && 
      user.name.includes(filter)
    );
  }
)(
  // The keySelector function creates a cache key from the arguments
  // In this case, we use a combination of libraryId and filter
  (state, libraryId, filter) => `${libraryId}:${filter}`
);

// Usage:
const state = { users: [/* ... user data ... */] };

// First call with 'react' library and 'john' filter
const reactUsersJohn = getUsersByLibraryAndFilter(state, 'react', 'john');
// Console: 'Expensive computation running!' (1st time)

// Second call with 'vue' library and 'smith' filter
const vueUsersSmith = getUsersByLibraryAndFilter(state, 'vue', 'smith');
// Console: 'Expensive computation running!' (2nd time, different key)

// Third call with 'react' library and 'john' filter again
// This time, it uses the CACHED selector for 'react:john'
const reactUsersJohnAgain = getUsersByLibraryAndFilter(state, 'react', 'john');
// No console output - cached result is used!
```

#### How @veksa/re-reselect works

When a cached selector is called, @veksa/re-reselect does the following:

1. **Evaluates the `cacheKey`** by executing the `keySelector` function with the current arguments
2. **Looks up** a previously created selector in its internal cache using this key
3. **Creates a new selector** if one doesn't exist for this key
4. **Returns the result** from the appropriate selector

The API is identical from the user's perspective, but @veksa/re-reselect maintains a cache of selectors keyed by the values you care about, preventing unnecessary recalculations.

### Basic Usage Patterns

#### Common Selector Patterns

When working with selectors that need parameters, several approaches are possible:

```typescript
// Pattern 1: Multiple discrete selectors (doesn't scale)
const getProduct1Stats = createSelector(
  getProducts,
  products => computeProductStatistics(products, 'product-1')
);

// Pattern 2: Parameterized selector (cache invalidation problem)
const getProductStats = createSelector(
  getProducts,
  (state, productId) => productId,
  (products, productId) => computeProductStatistics(products, productId)
);

// Pattern 3: Selector factory (complex lifecycle management)
const makeGetProductStats = (productId) => createSelector(/* ... */)

// Pattern 4: Cached selector (best solution)
const getProductStats = createCachedSelector(
  getProducts,
  (state, productId) => productId,
  (products, productId) => computeProductStatistics(products, productId)
)(
  (state, productId) => productId  // Cache key
);
```

#### Sharing Selectors Across Components

Use cached selectors to share selectors with props across multiple components:

```typescript
// selectors.js
import { createCachedSelector } from '@veksa/re-reselect';

const getVisibleTodos = createCachedSelector(
  [(state, props) => state.todoLists[props.listId].visibilityFilter,
   (state, props) => state.todoLists[props.listId].todos],
  (visibilityFilter, todos) => {
    switch (visibilityFilter) {
      case 'SHOW_COMPLETED': return todos.filter(t => t.completed);
      case 'SHOW_ACTIVE': return todos.filter(t => !t.completed);
      default: return todos;
    }
  }
)(
  (state, props) => props.listId  // Cache by listId
);

// In component - no factory pattern needed
const mapStateToProps = (state, props) => ({
  todos: getVisibleTodos(state, props)
});
```

## Advanced Caching Examples

### Cache Key Strategies

The `keySelector` function determines how selectors are cached. Here are common patterns:

```typescript
// 1. Simple parameter as key
const getUserPosts = createCachedSelector(
  getUser, getPosts,
  (user, allPosts) => allPosts.filter(post => post.userId === user.id) 
)(
  (state, userId) => userId  // Simple key
);

// 2. Composite keys from multiple parameters
const getFilteredItems = createCachedSelector(
  /* input selectors */
)(
  (state, categoryId, statusFilter) => `${categoryId}::${statusFilter || 'all'}`
);

// 3. Object property extraction
const getChartData = createCachedSelector(
  /* input selectors */
)(
  (state, options) => `${options.timeRange}::${options.aggregation}`
);

// 4. JSON serialization for complex objects
const getComplexCalculation = createCachedSelector(
  /* input selectors */
)(
  (state, complexConfig) => JSON.stringify(complexConfig)
);
```

### Dynamic Key Composition

For more complex scenarios, you can create dynamic cache keys that automatically adapt as your selectors evolve.

#### Key Selector Combiner

```typescript
// Create a utility that combines key selectors
function keySelectorCombiner({ inputSelectors = [] } = {}) {
  // Find input selectors with keySelector property
  const keySelectors = inputSelectors
    .map(selector => selector.keySelector)
    .filter(value => Boolean(value));

  return (...args) => {
    if (keySelectors.length === 0) {
      return args[1];
    }

    // Join all key parts with a separator
    return keySelectors
      .map(selector => selector(...args))
      .join('::');
  };
}
```

#### Attaching Key Selectors to Input Selectors

```typescript
// Input selectors with attached key information
const getUserById = (state, userId) => state.users[userId];
userById.keySelector = (state, userId) => `user:${userId}`;

const getTeamById = (state, userId) => {
  const user = getUserById(state, userId);
  return state.teams[user.teamId];
};
getTeamById.keySelector = (state, userId) => {
  const user = getUserById(state, userId);
  return `team:${user.teamId}`;
};

// Regular input selector that doesn't affect caching
const getGlobalSettings = state => state.settings;

// Combined selector with dynamic key composition
const getUserDashboardData = createCachedSelector(
  [
    getUserById,      // Has keySelector
    getTeamById,      // Has keySelector 
    getGlobalSettings // No keySelector, won't affect cache key
  ],
  (user, team, settings) => computeDashboardData(user, team, settings)
)(keySelectorCombiner); // Automatically creates composite key
```

#### Runtime Behavior

At runtime, the code above effectively creates this key selector:

```typescript
// Equivalent key selector generated at runtime
(state, userId) => `user:${userId}::team:${getUser(state, userId).teamId}`
```

#### Benefits of Dynamic Key Composition

- **Self-adapting** - Cache keys evolve automatically as input selectors change
- **Declarative** - Input selectors declare their own caching requirements
- **Maintainable** - No need to manually update key selectors when adding new cache dimensions
- **Separation of concerns** - Each selector defines its own caching behavior

## Testing Examples

### Testing Selectors

Cached selectors support both standard testing approaches and advanced cache-specific testing methods:

```typescript
// Basic result function testing
test('should filter users by ID', () => {
  const users = [{ id: 1 }, { id: 2 }];
  const userId = 1;
  
  // Direct access to the result function
  const result = getUsersById.resultFunc(users, userId);
  
  expect(result).toEqual([{ id: 1 }]);
});

// Testing structured selectors
test('should gather dashboard data', () => {
  const user = { id: 1, name: 'Test' };
  const metrics = { visits: 10 };
  const notifications = ['Message 1'];
  
  // Direct call to resultFunc with expected inputs
  const result = getDashboardData.resultFunc(user, metrics, notifications);
  
  expect(result).toEqual({
    user,
    metrics,
    notifications
  });
});

// Testing cache hits
test('should return cached result for same filter', () => {
  const state = { users: [/* data */] };
  const filter = 'test';
  
  const result1 = getFilteredUsers(state, filter);
  const result2 = getFilteredUsers(state, filter);
  
  // Same reference = cache hit
  expect(result1).toBe(result2); 
  expect(getFilteredUsers.recomputations()).toBe(1); // Only computed once
});

// Testing cache invalidation
test('should invalidate cache for different filters', () => {
  const state = { users: [/* data */] };
  
  getFilteredUsers(state, 'a');
  expect(getFilteredUsers.recomputations()).toBe(1);
  
  // Different key should compute again
  getFilteredUsers(state, 'b');
  expect(getFilteredUsers.recomputations()).toBe(2);
});

// Testing cache manipulation methods
test('should expose cache methods', () => {
  const state = { users: [/* data */] };
  
  // Call with filter 'a'
  getFilteredUsers(state, 'a');
  
  // Get underlying selector for key 'a'
  const underlyingSelector = getFilteredUsers.getMatchingSelector(state, 'a');
  expect(underlyingSelector).toBeDefined();
  
  // Remove specific key from cache
  getFilteredUsers.removeMatchingSelector(state, 'a');
  expect(getFilteredUsers.getMatchingSelector(state, 'a')).toBeUndefined();
  
  // Clear entire cache
  getFilteredUsers(state, 'a');
  getFilteredUsers(state, 'b');
  getFilteredUsers.clearCache();
  expect(getFilteredUsers.cache.size).toBe(0);
});
```

## API Reference

### Core Functions

#### createCachedSelector

```typescript
import {createCachedSelector} from '@veksa/re-reselect';

const myCachedSelector = createCachedSelector(
  // Input selectors (same as @veksa/reselect)
  inputSelector1,
  inputSelector2,
  // Result function
  (input1, input2) => computeResult(input1, input2)
)(
  // Either a simple keySelector function:
  (state, arg) => arg,
  // Or an options object:
  {
    keySelector: (state, arg) => arg,
    cacheObject: new LruObjectCache({cacheSize: 10}),
    // Other options...
  }
);
```

Creates a memoized selector with cache behavior based on a key selector function.

#### createStructuredCachedSelector

```typescript
import {createStructuredCachedSelector} from '@veksa/re-reselect';

const structuredSelector = createStructuredCachedSelector({
  value1: selector1,
  value2: selector2,
  // More key-selector pairs...
})(
  (state, arg) => arg // Key selector
);
```

Creates a structured cached selector that returns an object composed of the results of each input selector.

### Configuration Options

#### keySelector

Type: `function`<br />
Default: `undefined`

A function that determines the cache key for a selector call:

```typescript
// Simple key selector using a single parameter
(state, userId) => userId

// Composite key using multiple parameters
(state, categoryId, statusFilter) => `${categoryId}::${statusFilter}`
```

#### Cache Management

Type: `object`<br />
Default: `FlatObjectCache`

`@veksa/re-reselect` provides comprehensive cache management through the `cacheObject` option:

```typescript
import { createCachedSelector, LruObjectCache } from '@veksa/re-reselect';

const categoryProductsSelector = createCachedSelector(
  getAllProducts,
  (state, categoryId) => categoryId,
  (products, categoryId) => products.filter(p => p.categoryId === categoryId)
)({ 
  keySelector: (state, categoryId) => categoryId,
  cacheObject: new LruObjectCache({ cacheSize: 10 })
});
```

##### Built-in Cache Strategies

`@veksa/re-reselect` includes six ready-to-use cache implementations:

| Cache Strategy | Key Types | Eviction Policy | Storage | Use Case |
|:-------------:|:--------:|:-----------------:|:-------:|:--------:|
| `FlatObjectCache` | string/number | Unlimited | JS object | Simple selectors with few parameters |
| `FifoObjectCache` | string/number | First-in-first-out | JS object | When memory constraints exist |
| `LruObjectCache` | string/number | Least-recently-used | JS object | Most common use case (memory efficient) |
| `FlatMapCache` | any | Unlimited | Map | When keys are objects or other complex types |
| `FifoMapCache` | any | First-in-first-out | Map | Complex keys with memory constraints |
| `LruMapCache` | any | Least-recently-used | Map | Best overall for complex keys |

##### Limiting Cache Size

FIFO and LRU cache strategies accept a `cacheSize` parameter to control memory usage:

```typescript
// Limit to 5 most recently used items
const lruCache = new LruObjectCache({ cacheSize: 5 });

// Limit to 10 most recently added items
const fifoCache = new FifoMapCache({ cacheSize: 10 });
```

##### Implementation Notes

- `*ObjectCache` strategies convert number keys to strings (JS object limitation)
- `*MapCache` strategies support any key type but may require a polyfill in older browsers
- `FlatObjectCache`/`FlatMapCache` have no size limits and should be used carefully

##### Custom Cache Implementation

You can create your own cache object by implementing this interface:

```typescript
interface ICacheObject {
  // Store a selector function with the given key
  set(key: any, selectorFn: any): void;
  
  // Retrieve a selector function by key
  get(key: any): any;
  
  // Remove a specific selector from cache
  remove(key: any): void;
  
  // Clear the entire cache
  clear(): void;
  
  // Optional: Validate if a key is acceptable
  isValidCacheKey?(key: any): boolean;
}
```

This enables custom caching behaviors like time-based expiration, hybrid eviction policies, or integration with external caching systems.

#### keySelectorCreator

Type: `function`<br />
Default: `undefined`

Dynamically generates a key selector function based on the provided inputs:

```typescript
type keySelectorCreator = (selectorInputs: {
  inputSelectors: InputSelector[];
  resultFunc: ResultFunc;
  keySelector: KeySelector;
}) => KeySelector;
```

#### selectorCreator

Type: `function`<br />
Default: `createSelector` from `@veksa/reselect`

An alternative implementation of `createSelector` to be used internally.

### Selector Instance Methods

Cached selectors expose these methods:

#### Standard Methods (from @veksa/reselect)

- **`dependencies`**: Get array of input selectors
- **`resultFunc`**: Access the result function (useful for testing)
- **`recomputations()`**: Count how many times the selector has recalculated its value
- **`resetRecomputations()`**: Reset the recomputation counter

#### Cache-specific Methods

- **`getMatchingSelector(selectorArguments)`**: Get the underlying cached selector for specific arguments
- **`removeMatchingSelector(selectorArguments)`**: Remove a specific selector from cache
- **`cache`**: Access the cache object for advanced operations
- **`clearCache()`**: Clear the entire selector cache
- **`keySelector`**: Access the key selector function

## Contributing

This project welcomes contributions and suggestions.

## License

[MIT](LICENSE.md)
