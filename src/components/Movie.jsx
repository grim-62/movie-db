import React, { useEffect, useState } from 'react'
import TopNav from './partials/SearchBar'
import DropDown from './partials/DropDown'
import axios from '../utils/axios'
import VerticalCards from './partials/VerticalCards'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Link } from 'react-router-dom'
import CardLoader from './Loaders/CardLoader'


const Movie = () => {

  const [category, setcategory] = useState('popular')
  const [movies, setmovies] = useState([])
  const [page, setpage] = useState(1)
  const [hasMore, sethasMore] = useState(true)

  
  
  const getMovies = async () => {
    try {
      
      const { data } = await axios.get(`/movie/${category}?page=${page}`)
      if (data.results.length > 0) {
        setpage(page + 1)
        setmovies(prevState => [...prevState, ...data.results])
      } else {
        sethasMore(false)
      }
    } catch (error) {
      console.log(error)
    }
  }
  
  
  const refreshHandler = () => {
    if (movies.length === 0) {
      getMovies()
    } else {
      setpage(1)
      setmovies([])
      getMovies()
    }
  }
  
  
  
  useEffect(() => {
    refreshHandler()
    document.title=`${category.charAt(0).toUpperCase() + category.slice(1)}  Movies | ALDB`
  }, [category])


  return (movies.length > 0 ?
    <div className='w-full min-h-screen bg-gradient-to-r from-[#2a374b] via-[#406e77] to-[#417b78]'>
      <div className="px-8 py-4 flex lg:flex-row flex-col lg:items-center justify-between">
        <div className="flex items-center text-[#417b78]">
          <Link to="/">
            <i className="fa-solid fa-arrow-left-long mr-2 sm:mr-6 sm:text-2xl cursor-pointer hover:text-[#fc0] duration-300"></i>
          </Link>
          <h1 className=' sm:text-xl text-sm uppercase font-bold flex sm:flex-row flex-col sm:items-center sm:gap-1 text-nowrap'>Movie <span className='text-xs italic opacity-75'>({category})</span></h1>
          <TopNav />
        </div>
        <div className="flex items-center gap-4">

          <DropDown title="Category" options={["now_playing", "upcoming", "top_rated", "popular"]} func={(e) => setcategory(e.target.value)} />
        </div>

      </div>
      <InfiniteScroll
        dataLength={movies.length}
        next={getMovies}
        hasMore={hasMore}
        loader={
          <div className="flex flex-row gap-2 w-full justify-center h-40 items-center bg-gradient-to-r from-[#2a374b] via-[#406e77] to-[#417b78]">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#2a374b] via-[#406e77] to-[#417b78] shadow-xl animate-bounce [animation-delay:.7s]"></div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#2a374b] via-[#406e77] to-[#417b78] shadow-xl animate-bounce [animation-delay:.3s]"></div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#2a374b] via-[#406e77] to-[#417b78] shadow-xl animate-bounce [animation-delay:.7s]"></div>
          </div>
        }
      >

        <VerticalCards data={movies} title={"movie"} />
      </InfiniteScroll>

    </div>
    : <CardLoader />

  )
}

export default Movie