<script>
  import dayjs from "dayjs";
  import relativeTime from "dayjs/plugin/relativeTime";
  import { current } from "../stores.js";
  dayjs.extend(relativeTime);

  export let note;
  export let title;
  export let synopsis;
  export let date;
  export let category = "";

  const day = dayjs(date);
  let dateTooltip = day.format("DD/MM/YYYY HH:mm:ss");
  let dateRelative = day.fromNow();

  function select() {
    current.set(note);
  }
</script>

<style>
  a {
    margin: 0.25rem;
    display: block;
  }

  .outer {
    display: flex;
    border-style: solid;
    border-width: 1px;
    border-radius: 0.125rem;
    border-color: rgb(156, 163, 175);
    background-color: white;
    cursor: pointer;
  }

  .category {
    width: 0.5rem;
  }

  .inner {
    width: calc(100% - 0.5rem);
    padding: 0.25rem;
  }

  .noteTitle {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding-bottom: 0.25rem;
  }

  .noteSynopsis {
    overflow: hidden;
    font-size: 0.75rem;
    line-height: 1rem;
    height: 2rem;
  }

  .noteDate {
    text-align: right;
    padding-top: 0.25rem;
    font-size: 0.75rem;
    line-height: 1rem;
  }

  .red {
    background-color: rgb(248, 113, 113);
  }

  .blue {
    background-color: rgb(96, 165, 250);
  }
</style>

<a on:click={select}>
  <div class="outer">
    <div class="category {category}" />
    <div class="inner">
      <div class="noteTitle">{title}</div>
      <div class="noteSynopsis">{synopsis}</div>
      <div class="noteDate" title={dateTooltip}>
        {dateRelative}
      </div>
    </div>
  </div>
</a>
