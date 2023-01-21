import React, { FC } from 'react'
import { DragDropContext, Draggable, DraggableProvided, Droppable, OnDragEndResponder } from '@hello-pangea/dnd'
import { Center, Flex } from 'src/components'
import { theme } from 'antd'
import { HomeButton, Tab, OptionsMenu } from './components'
import Image from 'next/image'
import { useTerminal } from 'src/contexts'
import { useRouter } from 'next/router'

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

const Component: FC = () => {
    const { asPath } = useRouter()
    const {
        token: { paddingXS },
    } = theme.useToken()

    const { terminals, focused, focus } = useTerminal()

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

    return (
        <Flex className="gap-2" justify="space-between" style={{ padding: paddingXS }}>
            <HomeButton />

            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable" direction="horizontal">
                    {(droppable) => {
                        return (
                            <div className="flex w-full gap-2" ref={droppable.innerRef} {...droppable.droppableProps}>
                                {terminals.map((terminal, index) => (
                                    <Draggable key={index} draggableId={`draggable-${index}`} index={index}>
                                        {(draggable, snapshot) => {
                                            preventDragYMovement(draggable)

                                            return (
                                                <div className="flex flex-grow" ref={draggable.innerRef} {...draggable.draggableProps} {...draggable.dragHandleProps}>
                                                    <Tab
                                                        href="/terminal"
                                                        label={terminal.title}
                                                        icon={
                                                            <Center>
                                                                <Image src={terminal.shell.icon} alt="pty-icon" width={16} height={16} />
                                                            </Center>
                                                        }
                                                        onClick={() => focus(terminal.id)}
                                                        active={asPath === '/terminal' && focused === terminal.id}
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
