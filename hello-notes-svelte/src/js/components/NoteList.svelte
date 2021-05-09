<script>
  import { onMount } from "svelte";
  import NoteListItem from "./NoteListItem.svelte";

  let noteList = [];
  onMount(async () => {
    const res = await fetch("http://localhost:3000/notes");
    const json = await res.json();
    noteList = json.notes;
  });
</script>

<style>
  .column {
    width: 16rem;
    display: flex;
    flex-direction: column;
    border-style: solid;
    border-width: 0 1px 0 0;
    border-color: rgb(156, 163, 175);
    background-color: rgb(243, 244, 246);
  }

  .title {
    padding: 0.25rem;
    height: 2rem;
    border-style: solid;
    border-width: 0 0 1px 0;
    background-color: white;
  }

  .list {
    overflow-y: scroll;
  }
</style>

<div class="column">
  <div class="title">Notes</div>
  <div class="list">
    {#each noteList as note}
      <NoteListItem {note} {...note} />
    {/each}
  </div>
</div>
