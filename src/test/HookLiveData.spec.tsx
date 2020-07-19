import * as React from "react"
import {render, act} from "@testing-library/react"
import {expect} from "chai"

import HookLiveData from "../HookLiveData"
import {useEffect, useState} from "react"

describe("HookLiveData", () => {

    it("should handle single observer observe and auto-remove", () => {
        // Given
        const expected = "some value"

        class ViewModel {

            liveData: HookLiveData<String>

            constructor() {
                this.liveData = new HookLiveData<String>()
            }

            doSomethingInBackground(value: String) {
                this.liveData.postValue(value)
            }

        }

        const viewModel = new ViewModel()

        const View = () => {

            useEffect(() => {
                viewModel.doSomethingInBackground(expected)
            })

            const [value, setValue] = useState<String>("")

            viewModel.liveData.observe((actual) => {
                act(() => {
                    setValue(actual)
                })
            })

            return (
                <div>{value}</div>
            )
        }

        // When
        const {container, unmount} = render(<View/>)

        const div = container.childNodes[0]!

        // Then
        expect(div.textContent).equal(expected)

        expect(viewModel.liveData.getObservers()).length(1)

        unmount()

        expect(viewModel.liveData.getObservers()).length(0)
    })

    it("should handle single observer observe before call to postValue", () => {
        // Given
        const expected = "some value"

        class ViewModel {

            liveData: HookLiveData<String>

            constructor() {
                this.liveData = new HookLiveData<String>()
            }

            doSomethingInBackground(value: String) {
                this.liveData.postValue(value)
            }

        }

        const viewModel = new ViewModel()

        const View = () => {

            const [value, setValue] = useState<String>("")

            viewModel.liveData.observe((actual) => {
                act(() => {
                    setValue(actual)
                })
            })

            return (
                <div>{value}</div>
            )
        }

        // When
        const {container, unmount} = render(<View/>)

        viewModel.doSomethingInBackground(expected)

        const div = container.childNodes[0]!

        // Then
        expect(div.textContent).equal(expected)

        expect(viewModel.liveData.getObservers()).length(1)

        unmount()

        expect(viewModel.liveData.getObservers()).length(0)
    })

    it("should handle multiple observers observe and auto-remove", () => {
        // Given
        const expected1 = "some value"
        const expected2 = 42

        class ViewModel {

            liveData1: HookLiveData<String>
            liveData2: HookLiveData<number>

            constructor() {
                this.liveData1 = new HookLiveData<String>()
                this.liveData2 = new HookLiveData<number>()
            }

            doSomethingInBackground(value1: String, value2: number) {
                this.liveData1.postValue(value1)
                this.liveData2.postValue(value2)
            }

        }

        const viewModel = new ViewModel()

        const View = () => {

            useEffect(() => {
                viewModel.doSomethingInBackground(expected1, expected2)
            })

            const [value1, setValue1] = useState<String>("")
            const [value2, setValue2] = useState<number>(0)

            viewModel.liveData1.observe((actual) => {
                act(() => {
                    setValue1(actual)
                })
            })

            viewModel.liveData2.observe((actual: number) => {
                act(() => {
                    setValue2(actual)
                })
            })

            return (
                <div>
                    <h1>{value1}</h1>
                    <h2>{value2}</h2>
                </div>
            )
        }

        // When
        const {container, unmount} = render(<View/>)

        const first = container.childNodes[0].childNodes[0]!
        const second = container.childNodes[0].childNodes[1]!

        // Then
        expect(first.textContent).equal(expected1)
        expect(second.textContent).equal(expected2.toString())

        expect(viewModel.liveData1.getObservers()).length(1)
        expect(viewModel.liveData2.getObservers()).length(1)

        unmount()

        expect(viewModel.liveData1.getObservers()).length(0)
        expect(viewModel.liveData2.getObservers()).length(0)
    })
})