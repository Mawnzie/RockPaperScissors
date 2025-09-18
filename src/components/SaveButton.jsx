import {Button} from 'react-bootstrap';

import { getModel , jointOneHotEncode ,windowSize} from '../GameLogic/textModel'

export default function SaveButton(){
    const model = getModel();  
    const handleButtonClick = async () => {
        await model.save('downloads://my-model');
    }

    return <Button variant="secondary" onClick={handleButtonClick}>Save Model </Button>
}