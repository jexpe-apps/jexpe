import React, { FC } from 'react'
import {
    DragDropContext,
    Draggable,
    DraggableProvided,
    Droppable,
    OnDragEndResponder,
} from '@hello-pangea/dnd'
import { HomeButton, OptionsMenu, Tab } from './components'
import { useShell } from 'src/contexts'
import { IPty } from 'src/types'

const Component: FC = () => {
    const { ptys } = useShell()

    // a little function to help us with reordering the result
    // const reorder = (list: any, startIndex: any, endIndex: any) => {
    //     const result = Array.from(list)
    //     const [removed] = result.splice(startIndex, 1)
    //     result.splice(endIndex, 0, removed)
    //
    //     return result
    // }

    const onDragEnd: OnDragEndResponder = (result) => {
        // dropped outside the list
        if (!result.destination) {
            return
        }

        // const ordered = reorder(
        //     items,
        //     result.source.index,
        //     result.destination.index,
        // )
        //
        // // @ts-ignore
        // setItems([...ordered])
    }

    const preventDragYMovement = (provided: DraggableProvided) => {
        let transform = provided.draggableProps.style?.transform

        if (transform) {
            transform = transform.replace(/,\s[-+]*\d+px\)/, ', 0px)')
            provided.draggableProps.style = {
                ...provided.draggableProps.style,
                transform,
            }
        }
    }

    return (
        <div className="flex items-center p-2">
            <HomeButton />

            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable" direction="horizontal">
                    {(droppable) => (
                        <div
                            ref={droppable.innerRef}
                            {...droppable.droppableProps}
                            className="flex overflow-auto"
                        >
                            {Array.from(ptys.values()).map(
                                (pty: IPty, index) => (
                                    <Draggable
                                        key={pty.id}
                                        draggableId={pty.id}
                                        index={index}
                                    >
                                        {(draggable, state) => {
                                            preventDragYMovement(draggable)

                                            return (
                                                <div
                                                    ref={draggable.innerRef}
                                                    {...draggable.draggableProps}
                                                    {...draggable.dragHandleProps}
                                                >
                                                    <Tab
                                                        id={pty.id}
                                                        href={`/terminal/${pty.id}`}
                                                        title={
                                                            pty.shell
                                                                .display_name
                                                        }
                                                        icon={pty.shell.icon}
                                                        onClose={() => {
                                                            // TODO: handle kill pty
                                                        }}
                                                        dragging={
                                                            state.isDragging
                                                        }
                                                    />
                                                </div>
                                            )
                                        }}
                                    </Draggable>
                                )
                            )}

                            {droppable.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

            <OptionsMenu />
        </div>
    )
}

export default Component
