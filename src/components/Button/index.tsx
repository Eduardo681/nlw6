import '../../styles/button.scss';
import {ButtonProps} from "../../types/ButtonProps";


export function Button({isOutlined = false, ...props}: ButtonProps) {
    return (
        <button className={`button ${isOutlined ? 'outlined' : ''}`} {...props} />
    )
}