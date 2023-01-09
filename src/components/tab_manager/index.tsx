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
import { invoke } from '@tauri-apps/api/tauri'
import { Button, theme } from 'antd'

const Component: FC = () => {
    const { ptys } = useShell()
    const { token } = theme.useToken()
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
        <div
            className="flex items-center justify-between gap-x-2"
            style={{
                padding: token.paddingXS,
            }}
        >
            <div>
                <HomeButton />
            </div>
            <div className="w-full h-full overflow-hidden">
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="droppable" direction="horizontal">
                        {(droppable) => (
                            <div
                                ref={droppable.innerRef}
                                {...droppable.droppableProps}
                                className="flex gap-x-2 h-full"
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
                                                        className="w-full"
                                                    >
                                                        <Tab
                                                            id={pty.id}
                                                            href={`/terminal/${pty.id}`}
                                                            title={
                                                                pty.shell
                                                                    .display_name
                                                            }
                                                            icon={
                                                                pty.shell.icon
                                                            }
                                                            onClose={() => {
                                                                // TODO: handle kill pty
                                                                try {
                                                                    invoke(
                                                                        'kill_pty',
                                                                        {
                                                                            id: pty.id,
                                                                        }
                                                                    )
                                                                } catch (e) {
                                                                    console.log(
                                                                        e
                                                                    )
                                                                }
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
            </div>

            <div>
                <OptionsMenu />
            </div>
        </div>
    )
}

export default Component
