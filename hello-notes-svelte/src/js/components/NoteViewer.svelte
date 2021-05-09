<script>
  export let title;
  export let content;

  let actions = "";
</script>

<style>
  .outer {
    display: flex;
    flex: 1 1 0%;
    flex-direction: column;
  }

  .titleBar {
    display: flex;
    border-style: solid;
    border-width: 0 0 1px 0;
    border-color: rgb(156, 163, 175);
  }

  .titleBar div:first-child {
    height: 2rem;
    flex-grow: 1;
  }

  .bodyArea {
    flex: 1 1 0%;
    overflow-y: scroll;
  }
</style>

<div class="outer">
  <div class="titleBar">
    <div>{title}</div>
    <div>{actions}</div>
  </div>
  <div class="bodyArea">{@html content}</div>
</div>
