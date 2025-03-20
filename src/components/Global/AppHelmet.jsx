import React from 'react'
import { Helmet } from 'react-helmet'

export default function AppHelmet({title,desc}) {
    return (        
        <Helmet>
            <meta name="description" content={desc} />
            <title>{title}</title>
        </Helmet>
    )
}
