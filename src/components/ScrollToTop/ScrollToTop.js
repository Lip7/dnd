import React, {useState} from 'react';
import './ScrollToTop.css';
import mainLogo from'./arrow.png';

const ScrollToTop = () =>{

    const [visible, setVisible] = useState(false)

    const toggleVisible = () => {
        const scrolled = document.documentElement.scrollTop;
        if (scrolled > 300){
            setVisible(true)
        }
        else if (scrolled <= 300){
            setVisible(false)
        }
    };

    const scrollToTop = () =>{
        window.scrollTo({
            top: 0,
        });
    };

    window.addEventListener('scroll', toggleVisible);

    return (
        <button className={"ToTopButton"} onClick={scrollToTop} style={{display: visible ? 'inline' : 'none'}} >
            <img className={"ToTopImage"} alt="To Top Button" src={mainLogo} />
        </button>
    );
}

export default ScrollToTop;