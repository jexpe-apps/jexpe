import { HardDrives, Vault, X } from 'phosphor-react'
import { FC, useState } from 'react'
import { DragDropContext, Draggable, Droppable, OnDragEndResponder } from '@hello-pangea/dnd'
import { __TABS } from 'src/__dummy/tabs'

const Component: FC = () => {

    const [items, setItems] = useState(__TABS)

    // a little function to help us with reordering the result
    const reorder = (list: any, startIndex: any, endIndex: any) => {
        const result = Array.from(list)
        const [removed] = result.splice(startIndex, 1)
        result.splice(endIndex, 0, removed)

        return result
    }

    const onDragEnd: OnDragEndResponder = (result) => {
        // dropped outside the list
        if (!result.destination) {
            return
        }

        const ordered = reorder(
            items,
            result.source.index,
            result.destination.index,
        )

        // @ts-ignore
        setItems([...ordered])
    }


    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId='droppable' direction='horizontal'>
                {(provided, snapshot) => (

                    <div ref={provided.innerRef} {...provided.droppableProps} className='h-[50px] bg-primary-500 w-full flex overflow-auto p-2 pb-0'>

                        <div
                            className='flex mr-2 bg-primary-900 p-2 items-center justify-center rounded-t'>
                            <Vault size={24} weight='duotone' className='text-brand' />
                        </div>

                        {items.map((item: any, index: any) => (

                            <Draggable key={item.id} draggableId={item.id} index={index}>
                                {(provided, snapshot) => {

                                    let transform = provided.draggableProps.style?.transform

                                    if (transform) {
                                        transform = transform.replace(/,\s[-+]*\d+px\)/, ", 0px)");
                                        provided.draggableProps.style = {
                                            ...provided.draggableProps.style,
                                            transform,
                                        }
                                    }

                                    return (

                                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                                            className={`flex mr-2 items-center hover:bg-primary-900 p-2 justify-between rounded-t w-[258px] ${snapshot.isDragging ? 'bg-primary-900' : 'bg-primary-700'}`}>

                                            <div className='h-full flex items-center gap-2'>
                                                <HardDrives size={24} weight='duotone' />
                                                <p>{item.display_name}</p>
                                            </div>

                                            <button className='p-1 hover:bg-primary-700 hover:text-brand-red rounded flex items-center justify-center'>
                                                <X size={12} />
                                            </button>

                                        </div>

                                    )
                                }}

                            </Draggable>

                        ))}

                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    )

}

export default Component