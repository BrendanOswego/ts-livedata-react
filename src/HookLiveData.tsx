import * as React from "react"

import {MutableLiveData, LiveData, Observer} from "@ts-livedata/core"
import {useEffect} from "react";

/**
 * React Hook LiveData (similar to {@link MutableLiveData}) which removes observers automatically once unmounted.
 */
class HookLiveData<T> extends LiveData<T> {

    /**
     * Attaches and detaches Observer to React functional component.
     *
     * @remarks
     * Should be used within scope of React Hooks, not {@link React.Component}.
     * Otherwise runtime error will be thrown from React.
     *
     * @param observer  The observer to watch for changes.
     */
    observe(observer: Observer<T>) {
        useEffect(() => {
            this.observers.push(observer)
            const tData = this.data
            if (tData != null) observer(tData)
            return () => {
                this.removeObserver(observer)
            }
        }, [])
    }

    /**
     * Sets current LiveData value, and notifies observers.
     *
     * @param value The value to set.
     */
    public postValue(value: T) {
        this.data = value
        this.observers.forEach(observer => {
            observer(value)
        })
    }
}

export default HookLiveData