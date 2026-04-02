import { supabase } from '../lib/supabase';

// -----------------------------------
// fetch basic person record
// -----------------------------------
export async function fetchPersonById(personId) {
  const { data, error } = await supabase
    .from('people')
    .select('person_id, name')
    .eq('person_id', personId)
    .single();

  if (error) {
    console.error('Error fetching person:', error.message);
    throw new Error('Failed to fetch person.');
  }

  return data;
}

// -----------------------------------
// fetch actor credits
// gets movies where person appears in cast_credits
// -----------------------------------
export async function fetchActorCredits(personId) {
  const { data, error } = await supabase
    .from('cast_credits')
    .select(`
      movie_id,
      character,
      cast_order,
      movies (
        movie_id,
        title,
        release_year,
        release_date
      )
    `)
    .eq('person_id', personId)
    .order('cast_order', { ascending: true });

  if (error) {
    console.error('Error fetching actor credits:', error.message);
    return [];
  }

  return (data || []).map((row) => ({
    movie_id: row.movie_id,
    character: row.character,
    cast_order: row.cast_order,
    title: row.movies?.title ?? 'Unknown Movie',
    release_year: row.movies?.release_year ?? null,
    release_date: row.movies?.release_date ?? null,
  }));
}

// -----------------------------------
// fetch director credits
// gets movies where person is in crew_credits as Director
// -----------------------------------
export async function fetchDirectorCredits(personId) {
  const { data, error } = await supabase
    .from('crew_credits')
    .select(`
      movie_id,
      job,
      department,
      movies (
        movie_id,
        title,
        release_year,
        release_date
      )
    `)
    .eq('person_id', personId)
    .eq('job', 'Director');

  if (error) {
    console.error('Error fetching director credits:', error.message);
    return [];
  }

  const mapped = (data || []).map((row) => ({
    movie_id: row.movie_id,
    job: row.job,
    department: row.department,
    title: row.movies?.title ?? 'Unknown Movie',
    release_year: row.movies?.release_year ?? null,
    release_date: row.movies?.release_date ?? null,
  }));

  mapped.sort((a, b) => {
    const yearA = a.release_year ?? 0;
    const yearB = b.release_year ?? 0;
    return yearB - yearA;
  });

  return mapped;
}

// -----------------------------------
// fetch non-director crew credits if needed
// optional extra
// -----------------------------------
export async function fetchOtherCrewCredits(personId) {
  const { data, error } = await supabase
    .from('crew_credits')
    .select(`
      movie_id,
      job,
      department,
      movies (
        movie_id,
        title,
        release_year,
        release_date
      )
    `)
    .eq('person_id', personId)
    .neq('job', 'Director');

  if (error) {
    console.error('Error fetching other crew credits:', error.message);
    return [];
  }

  return (data || []).map((row) => ({
    movie_id: row.movie_id,
    job: row.job,
    department: row.department,
    title: row.movies?.title ?? 'Unknown Movie',
    release_year: row.movies?.release_year ?? null,
    release_date: row.movies?.release_date ?? null,
  }));
}

// -----------------------------------
// load full page data
// determines actor / director / both
// -----------------------------------
export async function fetchPersonPageData(personId) {
  const [person, actorCredits, directorCredits] = await Promise.all([
    fetchPersonById(personId),
    fetchActorCredits(personId),
    fetchDirectorCredits(personId),
  ]);

  const isActor = actorCredits.length > 0;
  const isDirector = directorCredits.length > 0;

  return {
    person,
    actorCredits,
    directorCredits,
    isActor,
    isDirector,
  };
}