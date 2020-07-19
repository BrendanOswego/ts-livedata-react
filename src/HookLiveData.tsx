import * as React from "react"

import {LiveData, Observer} from "@ts-livedata/core"
import {useEffect} from "react";

class HookLiveData<T> extends LiveData<T> {

    readonly DEBUG: Boolean = true

    /**
     * Attaches and detaches Observer to React functional component.
     *
     * @remarks
     * Should be used within scope of React Hooks, not {@link React.Component}.
     *
     * @param observer  The observer to watch for changes.
     */
    observe(observer: Observer<T>) {
        useEffect(() => {
            if (this.DEBUG) {
                console.log("adding observer")
            }
            this.observers.push(observer)
            const tData = this.data
            if (tData != null) observer(tData)
            return () => {
                if (this.DEBUG) {
                    console.log("removing observer")
                }
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