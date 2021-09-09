import React from 'react'

const Restaurant = ({place}) => {
    let hours = new Date().getDay() - 1;
    hours = place.opening_hours.weekday_text[hours]
    let address = place.formatted_address.split(',')
    address = address[0]
    return (
        <div className="place">
            <h2 className="name">{place.name}</h2>
            <h4 className="hours">{hours}</h4>
            <p className="telephone">{place.formatted_phone_number}</p>
            <p className="address">{address}</p>
        </div>
    )
}

export default Restaurant
