import '../App.css'
import React from 'react'
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import { grey } from '@mui/material/colors';

export default function PageNotFound() {
    return (
        <div className='notFound'>
            <p className='notFoundText'>
                <b>PAGE NOT FOUND</b>
                <br /><br />
                We cannot find the page you are looking for! Please go back to the previous page or head to our <Link to="/home">home page</Link>.
            </p>

        </div>
    );
}