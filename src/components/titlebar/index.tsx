import { FC } from 'react'

const Component: FC = () => {
    return (
        <div data-tauri-drag-region>
            <div className='titlebar-button' id='titlebar-minimize'>
                <img
                    src='https://api.iconify.design/mdi:window-minimize.svg'
                    alt='minimize'
                />
            </div>
            <div className='titlebar-button' id='titlebar-maximize'>
                <img
                    src='https://api.iconify.design/mdi:window-maximize.svg'
                    alt='maximize'
                />
            </div>
            <div className='titlebar-button' id='titlebar-close'>
                <img src='https://api.iconify.design/mdi:close.svg' alt='close' />
            </div>
        </div>
    )
}

export default Component