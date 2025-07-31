import {Button} from 'react-bootstrap';

export default function MyButton({choice, setChoices}){
    const handleButtonClick = () => {
        setChoices(prev =>[...prev, choice])
    }

    return <Button variant="secondary" onClick={handleButtonClick}>{choice}</Button>
}