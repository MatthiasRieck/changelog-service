import { FC, MouseEvent } from "react";
import './selected-submodule.css'

interface Props {
    name: string;
    onClick: (value: string) => void;
    // any props that come into the component event: MouseEvent<HTMLButtonElement>, 
}

const Submodule: FC<Props> = ({ name, onClick }) => {
    return (
        <span className="selected-submodule">{name} <button onClick={(e: MouseEvent) => onClick(name)}>
            <svg width="16" height="16" viewBox="0 0 16 16">
                <line x1="4" y1="4" x2="12" y2="12" stroke="rgba(0 0 0 / 0.5)" />
                <line x1="12" y1="4" x2="4" y2="12" stroke="rgba(0 0 0 / 0.5)" />
            </svg></button></span>
    )
}

export default Submodule