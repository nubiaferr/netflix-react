/* eslint-disable import/no-anonymous-default-export */
import React, { useEffect, useState } from "react";
import './App.css';
import Tmdb from "./Tmdb";
import MovieRow from "./components/MovieRow";
import FeaturedMovie from "./components/FeaturedMovie";
import Header from "./components/Header";


export default () => {

  const [movieList, setMovieList] = useState([]);
  const [featuredData, setFeaturedData] = useState(null);
  const [blackHeader, setBlackHeader] = useState(false);

  useEffect(()=>{
      const loadAll = async () => {
        //pegando a lista TOTAL
        let list = await Tmdb.getHomeList();
        setMovieList(list);

        //pegando o FEATURED
        let originals = list.filter(i=> i.slug === 'originals');
        let randomChosen = Math.floor(Math.random()*(originals[0].items.results.length - 1));
        let chosen = originals[0].items.results[randomChosen];
        let chosenInfo = await Tmdb.getMovieInfo(chosen.id, 'tv');
        setFeaturedData(chosenInfo);

      }

      loadAll();
  }, []);

  useEffect(()=>{
      const scrollListener = () => {
        if (window.scrollY > 20) {
          setBlackHeader(true);
        } else {
          setBlackHeader(false);
        }
      }

      window.addEventListener('scroll', scrollListener);
      return () => {
        window.removeEventListener('scroll', scrollListener);
      }
  }, []);

  return (
    <div className="page">

      <Header black={blackHeader}/>

      {featuredData &&
        <FeaturedMovie item={featuredData}/>
      }
      
      <section className="lists">
        {movieList.map((item, key) =>(
          <MovieRow key={key} title={item.title} items={item.items}/>
        ))}
      </section>

      <footer>
        <p>Copyright©: <a href="https://www.netflix.com/" target="_blank" rel="noreferrer">Netflix</a> & <a href="https://www.youtube.com/channel/UCw9mYSlqKRXI6l4vH-tAYpQ" target="_blank" rel="noreferrer">B7Web</a></p>
        <p>Database: <a href="https://www.themoviedb.org/">TMDB</a></p>
        <p>Made by: <a href="https://www.linkedin.com/in/nubia-ferreira/">Nubia Ferr</a></p>
      </footer>

      {movieList.length <= 0 && 
        <div className="loading">
          <img src="https://media.filmelier.com/noticias/br/2020/03/Netflix_LoadTime.gif" alt="Carregando" />
        </div>
      }

    </div>
  );
}