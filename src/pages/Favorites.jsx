import Card from '../components/Card/Card'

export default function Favorites({ items, onAddToFavorite }){
  return (
    <div className="content p-40">
      <div className="d-flex align-center justify-between mb-40">
        <h1>Мои закладки</h1>
      </div>

      <div className="d-flex flex-wrap">
        {items.map(item => (
          <Card
            key={item.imageUrl} 
            favorited={true}
            onFavorite={onAddToFavorite}
            {...item}
          />
        ))}
      </div>
    </div>
  )
}