import {FC} from "react";
import {SpinnerGap} from "phosphor-react";

const Component: FC<{
    size?: number;
    className?: string;
}> = ({size, className}) => (
    <div className='relative'>
        <SpinnerGap weight='bold' className={`animate-spin ${className ? className : 'text-primary-900'}`}
                    size={size ?? 54}/>
    </div>
);
export default Component;