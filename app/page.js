"use client"
import { useEffect, useState } from 'react';

export default function Home() {

  // **************** POST DATA ******************** 
  // ****************   START   ******************** 
  const [formData, setFormData] = useState({
    nodeId: 'ns=3;s="OPCUA".value6',
    attributeId: 13,
    value: {
      value: {
        dataType: 12,
        value: 'text',
      },
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault(); 

    try {
      const response = await fetch('/api/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log('Data submitted successfully');
        console.log(body);
        // Add any additional logic here after successful submission
      } else {
        console.error('Failed to submit data');
      }
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData,
      value: {
        value: {
          dataType: 12,
          value: e.target.value,
        },
      },
    });
  };
  // **************** POST DATA ******************** 
  // ****************   END     ******************** 

  const [data, setData] = useState([]);
  const fetchData = async () => {
    try {
      const response = await fetch('/api/data'); // Replace with your actual endpoint
      const result = await response.json();
      const resultArray = result.message.map(item => item.value.value);
      setData(resultArray);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    // Fetch data initially when the component mounts
    fetchData();

    // Set up an interval to fetch data every second
    const intervalId = setInterval(() => {
      fetchData();
    }, 1000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);


  return (
    <>
    <div>
      <h1>Custom Page</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Data:
          <input type="text" name="data" onChange={handleChange} />
          <p>Data: {data[5]}</p>
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
    
    <div>
        <h1>Your Next.js Page</h1>
        {data && (
          <div>
            <p>Data: {data[0]}</p>
            {/* Render the fetched data as needed */}
          </div>
        )}
    </div>
    </>
  )
}
