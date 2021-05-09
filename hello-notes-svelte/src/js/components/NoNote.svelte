<style>
  .outer {
    display: flex;
    flex: 1 1 0%;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 0.75rem;
    line-height: 1.5rem;
  }

  .outer div:first-child {
    padding-bottom: 0.5rem;
  }

  button i,
  button span {
    vertical-align: middle;
  }
</style>

<div class="outer">
  <div class="pb-2">Note has not been found. It may have been deleted.</div>
  <div>
    <button title="Add">
      <i class="material-icons align-middle">add</i>
      <span>Add note</span>
    </button>
  </div>
</div>
