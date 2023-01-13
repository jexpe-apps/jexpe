import React, { FC } from 'react'
import {
    DragDropContext,
    Draggable,
    DraggableProvided,
    Droppable,
    OnDragEndResponder,
} from '@hello-pangea/dnd'
import { Center, Flex } from 'src/components'
import { theme } from 'antd'
import { HomeButton, Tab, OptionsMenu } from './components'
import Image from 'next/image'
import { usePty } from 'src/contexts'

const Component: FC = () => {
    const { ptys, currentPty, setCurrentPty } = usePty()
    const { token: { paddingXS } } = theme.useToken()

    console.log('Component updated', currentPty)

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
        <Flex
            className='gap-2'
            justify='space-between'
            style={{ padding: paddingXS }}
        >
            <HomeButton />

            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId='droppable' direction='horizontal'>
                    {(droppable) => {
                        return (
                            <div
                                className='flex w-full gap-2'
                                ref={droppable.innerRef}
                                {...droppable.droppableProps}
                            >
                                {ptys.map((pty, index) => (
                                    <Draggable
                                        key={index}
                                        draggableId={`draggable-${index}`}
                                        index={index}
                                    >
                                        {(draggable, snapshot) => {

                                            preventDragYMovement(draggable)

                                            return (
                                                <div
                                                    className={`flex flex-grow`}
                                                    ref={draggable.innerRef}
                                                    {...draggable.draggableProps}
                                                    {...draggable.dragHandleProps}
                                                >
                                                    <Tab
                                                        href='/terminal'
                                                        label={pty.shell.display_name}
                                                        icon={
                                                            <Center>
                                                                <Image
                                                                    src={pty.shell.icon}
                                                                    alt='pty-icon'
                                                                    width={16}
                                                                    height={16}
                                                                />
                                                            </Center>
                                                        }
                                                        onClick={() => setCurrentPty(pty.id)}
                                                        active={currentPty === pty.id}
                                                        dragging={snapshot.isDragging}
                                                    />
                                                </div>
                                            )
                                        }}
                                    </Draggable>
                                ))}
                                {droppable.placeholder}
                            </div>
                        )
                    }}
                </Droppable>
            </DragDropContext>

            <OptionsMenu />
        </Flex>
    )
}

export default Component
