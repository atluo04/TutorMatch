import './Card.css';

function Card({name, major, about, comment}) {
    return (
        <div className='Card'>
            <div className='upper-container'>
                <div className='image-container'>
                    <img src='https://blog.kakaocdn.net/dn/GHYFr/btrsSwcSDQV/UQZxkayGyAXrPACyf0MaV1/img.jpg' alt='' height='100px' width='100px' />
                </div>
            </div>
            <div className='lower-container'>
                <h3> {name} </h3>
                <h4> {major} </h4>
                <p> {about} </p>
                <p> {comment} </p>
                <button>Send a message</button>
            </div>
        </div>
    );
}

export default Card;