
import React from 'react'

export default function Booking() {
  return (
    <div className='co'>
      <form action="">
  <label htmlFor="fname">Full Name:</label>
  <input type="text" name="fname" id="fname" placeholder="Enter your Full Name" /> <br />

  <label htmlFor="pnum">Phone Number:</label>
  <input type="number" name="pnum" id="pnum" placeholder="Enter your Phone Number" />
  <br />

  <label htmlFor="date">Date:</label>
  <input type="date" name="date" id="date" placeholder="Enter the date" />
  <br />

  <label htmlFor="country">Service:</label>
 <select name="" id="">
  <option value="default">Choose Our Services</option>
  <option value="">HairCut (Rs.200)</option>
  <option value="">Shaving (Rs.150)</option>
  <option value="">HairCut and Shaving (Rs.250)</option>
  <option value="">Hair Color (Rs.500)</option>
  <option value="">HairCut and Wash (Rs.350)</option>
 </select>
  <br />

  <label htmlFor="time">Time:</label>
  <input type="time" name="time" id="time" placeholder="Enter the date" />
  <br />
  <button type="submit">Send</button>

</form>

    </div>
  )
}
