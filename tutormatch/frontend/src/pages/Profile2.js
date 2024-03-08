import React, {useEffect, useState} from 'react';
import { useParams } from "react-router-dom";
import { Card } from "../components/Card.js";
import { useUser } from '../userContext.js';

export default function OthersProfile() {
    let { userId } = useParams();

    return (
        <>
            <Card userId={userId}/>
        </>
    )
}