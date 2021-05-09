<script>
  import Navigation from "./components/Navigation.svelte";
  import NoteList from "./components/NoteList.svelte";
  import NoteViewer from "./components/NoteViewer.svelte";
  import NoNote from "./components/NoNote.svelte";
  import { current } from "./stores.js";

  let note;
  current.subscribe(value => {
    note = value;
  });
</script>

<style>
  main {
    height: 100vh;
    display: flex;
  }
</style>

<svelte:head>
  <title>Hello Notes</title>
  <link
    href="https://fonts.googleapis.com/icon?family=Material+Icons"
    rel="stylesheet"
  />
  <link
    href="https://cdnjs.cloudflare.com/ajax/libs/modern-normalize/1.0.0/modern-normalize.min.css"
    rel="stylesheet"
  />
</svelte:head>

<main>
  <Navigation />
  <NoteList />
  {#if note}
    <NoteViewer {...note} />
  {:else}
    <NoNote />
  {/if}
</main>
