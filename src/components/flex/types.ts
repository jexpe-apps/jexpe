import { Property } from 'csstype'
import { Attributes, HTMLAttributes, RefAttributes } from 'react'

export interface IFlexProps extends HTMLAttributes<HTMLDivElement>, RefAttributes<HTMLDivElement> {
    direction?: Property.FlexDirection;
    align?: Property.AlignItems;
    justify?: Property.JustifyContent;
    wrap?: Property.FlexWrap;
    basis?: Property.FlexBasis;
    grow?: Property.FlexGrow;
    shrink?: Property.FlexShrink;
}