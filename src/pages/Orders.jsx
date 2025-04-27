import { useContext, useEffect, useState } from 'react'
import Card from '../components/Card/Card'
import axios from 'axios'
import AppContext from '../context'

export default function Orders(){
  const { onAddToFavorite, onAddToCart } = useContext(AppContext)
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchOrders() {
      try {
        setIsLoading(true)
        const { data } = await axios.get('https://680a1df31f1a52874cdf39cb.mockapi.io/orders')
        setOrders(data.reduce((prev, obj)=> [...prev, ...obj.items] , []))
        setIsLoading(false)
      } catch (error) {
        alert('Ошибка при загрузки заказов')
        console.error(error)
      }
    }

    fetchOrders()
  }, [])

  return (
    <div className="content p-40">
      <div className="d-flex align-center justify-between mb-40">
        <h1>Мои заказы</h1>
      </div>

      <div className="d-flex flex-wrap">
        {(isLoading ? [...Array(8)] : orders).map((item, index) => (
          <Card
          key={index} 
          loading={isLoading}
          {...item}
          />
        ))}
      </div>
    </div>
  )
}