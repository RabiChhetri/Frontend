
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

  <label htmlFor="country">Country:</label>
 <select name="" id="">
  <option value="">Nepal</option>
  <option value="">India</option>
  <option value="">Germany</option>
  <option value="">China</option>
  <option value="">Others</option>
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
