const moviesData = [
    {
      id: 1,
      title: 'Inception',
      description: 'A mind-bending thriller by Christopher Nolan.',
      image: 'https://m.media-amazon.com/images/I/81p+xe8cbnL._AC_SY679_.jpg',
      price:120,
    },
    {
      id: 2,
      title: 'The Matrix',
      description: 'A hacker discovers the real world beyond the simulation.',
      image: 'https://m.media-amazon.com/images/I/51EG732BV3L.jpg',
      price:220,
    },
    {
      id: 3,
      title: 'Interstellar',
      description: 'A team travels through a wormhole to save humanity.',
      image: 'https://rajeevraghunath.wordpress.com/wp-content/uploads/2015/02/interstellar-1.jpg',
      price:200,
    },
    {
      id: 4,
      title: 'The Dark Knight',
      description: 'Batman faces the Joker in a battle for Gotham.',
      image: 'https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/et00001634.jpg',
      price:180,
    },
    {
      id: 5,
      title: 'Avatar',
      description: 'A marine becomes part of the Na\'vi on Pandora.',
      image: 'https://m.media-amazon.com/images/I/41kTVLeW1CL.jpg',
      price:150,
    },
    {
      id: 6,
      title: 'Titanic',
      description: 'A tragic love story aboard the ill-fated Titanic.',
      image: 'https://i.ebayimg.com/00/s/NzU1WDUxMA==/z/siQAAOSw4aRh9EoT/$_57.JPG?set_id=8800005007',
      price:120,
    },
    {
      id: 7,
      title: 'Avengers: Endgame',
      description: 'The Avengers fight to reverse Thanos\' snap.',
      image: 'https://m.media-amazon.com/images/I/81ExhpBEbHL._AC_SY679_.jpg',
      price:190,
    },
    {
      id: 8,
      title: 'Joker',
      description: 'A failed comedian descends into madness.',
      image: 'https://m.media-amazon.com/images/I/71lqsaHjySL.jpg',
    },
    {
      id: 9,
      title: 'Spider-Man: No Way Home',
      description: 'Spider-Men unite across the multiverse.',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEf-FnIfWjCkVhAqjnK2Jjtkjk2B3Pq-LMSQ&s',
    },
    {
      id: 10,
      title: 'Doctor Strange',
      description: 'A surgeon becomes the master of the mystic arts.',
      image: 'https://m.media-amazon.com/images/I/71niXI3lxlL._AC_SY679_.jpg',
    },
    {
      id: 11,
      title: 'Black Panther',
      description: 'T\'Challa returns to Wakanda to take the throne.',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsf1yfgE1QeiYpXLe9Jg3VYEsuhCz2WARKZNhMcUCta7aZ6jUdm1RxtPJK4RtD7GdJNQ4&usqp=CAU',
    },
    {
      id: 12,
      title: 'Iron Man',
      description: 'Tony Stark builds a suit to escape captivity.',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQH0nfaNUURMbwvjA_5IlrUPzpkwAv16IDMlQ&s',
    },
    {
      id: 13,
      title: 'Captain America: Civil War',
      description: 'The Avengers are divided over government control.',
      image: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/fb2b8266-e162-42a4-95b5-ae8c4bc73238/d9hruvc-1af701ff-d4fc-4894-985e-265a9035fba9.jpg/v1/fill/w_1280,h_1920,q_75,strp/captain_america__civil_war_teaser_poster_a_by_jonesyd1129_d9hruvc-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2ZiMmI4MjY2LWUxNjItNDJhNC05NWI1LWFlOGM0YmM3MzIzOFwvZDlocnV2Yy0xYWY3MDFmZi1kNGZjLTQ4OTQtOTg1ZS0yNjVhOTAzNWZiYTkuanBnIiwiaGVpZ2h0IjoiPD0xOTIwIiwid2lkdGgiOiI8PTEyODAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uud2F0ZXJtYXJrIl0sIndtayI6eyJwYXRoIjoiXC93bVwvZmIyYjgyNjYtZTE2Mi00MmE0LTk1YjUtYWU4YzRiYzczMjM4XC9qb25lc3lkMTEyOS00LnBuZyIsIm9wYWNpdHkiOjk1LCJwcm9wb3J0aW9ucyI6MC40NSwiZ3Jhdml0eSI6ImNlbnRlciJ9fQ.9nBN_I8QksngRaCuR7EUQ2d2Mdu5hyJKpDq2lJFaIwM',
    },
    {
      id: 14,
      title: 'Guardians of the Galaxy',
      description: 'A group of misfits band together to save the galaxy.',
      image: 'https://m.media-amazon.com/images/I/81aA7hEEykL._AC_UY182_.jpg',
    },
    {
      id: 15,
      title: 'Thor: Ragnarok',
      description: 'Thor teams up with Hulk to stop Hela.',
      image: 'https://m.media-amazon.com/images/I/81aA7hEEykL._AC_UY182_.jpg',
    },
  ];
  
  export default moviesData;
  