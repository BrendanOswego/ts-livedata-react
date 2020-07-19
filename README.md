## TS LiveData React Library
[![npm version](https://badge.fury.io/js/%40ts-livedata%2Freact.svg)](https://badge.fury.io/js/%40ts-livedata%2Freact)
[![CircleCI](https://img.shields.io/circleci/project/github/brendangoldberg/ts-livedata-react/master.svg)](https://circleci.com/gh/brendangoldberg/ts-livedata-react/tree/master)

### About
Observer pattern based library for React, similar to Android's [LiveData](https://developer.android.com/topic/libraries/architecture/livedata).

For information on the Observer pattern please visit [Wikipedia](https://en.wikipedia.org/wiki/Observer_pattern#:~:text=The%20observer%20pattern%20is%20a,calling%20one%20of%20their%20methods.).

Includes [@ts-livedata/core](https://www.npmjs.com/package/@ts-livedata/core) separately to reduce dependency trees.

### Installation
```javascript
npm install @ts-livedata/react
```

```javascript
yarn add @ts-livedata/react
```

### Usage
```typescript jsx
// View.tsx

import * as React from "react"
import {HookLiveData} from "@ts-livedata/react"

export class ViewModel {

    // our value for presentation
    count: number

    // our LiveData for observing changes to `count`
    countLiveData: HookLiveData<number>

    // our LiveData for observing loading state
    loadingLiveData: HookLiveData<boolean>

    constructor() {
        this.countLiveData = new HookLiveData<number>()
        this.loadingLiveData = new HookLiveData<boolean>()
        this.count = 0
    }

    doSomethingInBackground() {
        // do some heavy lifting in background, set loading to true
        this.loadingLiveData.postValue(true)
        setTimeout(() => {
            this.count += 1
            this.countLiveData.postValue(this.count)
            this.loadingLiveData.postValue(false)
        }, 1000)
    }
}

const viewModel = new ViewModel()

export const View = () => {

    // Need useState hook to tell React to re-render component with our new data

    const [count, setCount] = React.useState<number>(0)
    const [loading, setLoading] = React.useState<boolean>(false)

    // observe our LiveData's, this will auto-remove observer on component unmount
    viewModel.countLiveData.observe((x: number) => {
        setCount(x)
    })

    viewModel.loadingLiveData.observe((x: boolean) => {
        setLoading(x)
    })

    return (
        <div>

            {/* when click do something in background */}
            <button onClick={() => viewModel.doSomethingInBackground()}>Click me</button>

            {/* the value of count */}
            <h2>{count}</h2>

            {/* show a small loader when true*/}
            {loading ? <div>loading</div> : null}
        </div>
    )
}
```
```typescript jsx
// View.spec.tsx

import {expect} from "chai"
import {renderHook} from "@testing-library/react-hooks"
import {ViewModel} from "./View"

jest.useFakeTimers()

describe("ViewModel", () => {
    it("should update hook and remove observer once unmounted", () => {
        // Given
        const expectedCount = 1

        const viewModel = new ViewModel()

        // simpler to test returning promise with resolve on observed value
        const {result, unmount} = renderHook(() => {
            return new Promise<number>(resolve => {
                viewModel.countLiveData.observe((count: number) => {
                    resolve(count)
                })
            })
        })

        // When
        viewModel.doSomethingInBackground()

        jest.advanceTimersByTime(1000)

        // Then
        result.current.then(actual => {
            expect(actual).equal(expectedCount)
        })

        let observers = viewModel.countLiveData.getObservers()

        expect(observers).length(1)

        unmount()

        observers = viewModel.countLiveData.getObservers()

        expect(observers).length(0)
    })
})
```

### Questions
Feel free to drop a Github issue with any questions you may have.

### License
This project is licensed under the terms of the [Apache 2.0 license](https://www.apache.org/licenses/LICENSE-2.0).
