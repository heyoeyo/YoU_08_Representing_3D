
// Hard-code expected CSS classes
const PAGECSS = {low_contrast: "low_contrast", text_highlight: "text_hl", none: ""};


class InteractiveTextListing {

  // .................................................................................................................

  constructor(text_block_id, uv_svg_base_id, xyz_svg_base_id) {

    // Attach clearing function on text block, to remove all highlighting effects when not in use
    const text_container = document.getElementById(text_block_id);
    text_container.addEventListener("mouseout", this.clear_svg_highlights);

    // Store reference to base svg group, so we can adjust contrast
    this.svg_uv_base = document.getElementById(uv_svg_base_id);
    this.svg_xyz_base = document.getElementById(xyz_svg_base_id);

    // Create reference to highlight groups as well, so we can toggle highlights
    this.svg_uv_hl_group = document.querySelectorAll(`#${uv_svg_base_id}_hl > use`);
    this.svg_xyz_hl_group = document.querySelectorAll(`#${xyz_svg_base_id}_hl > use`);

    // Allocate storage for tagged highlighted text elements (so that we can keep track of highlights to remove)
    this._highlighted_text_ids = [];
  }

  // .................................................................................................................

  clear_svg_highlights = () => {

    // Remove the low-contrast class so that diagram goes back to normal
    this.svg_xyz_base.classList.remove(PAGECSS.low_contrast);
    this.svg_uv_base.classList.remove(PAGECSS.low_contrast);

    // Clear all uv highlight (<use>) elements
    for (const hl_ref of this.svg_uv_hl_group) {
      set_svg_highlight(hl_ref, PAGECSS.none);
    }

    // Clear all xyz highlight (<use>) elements
    for (const hl_ref of this.svg_xyz_hl_group) {
      set_svg_highlight(hl_ref, PAGECSS.none);
    }

    return;
  }

  // .................................................................................................................

  highlight_svg_elements = (uv_ids, xyz_ids) => {

    // Knock out base contrast to help highlight selections
    this.svg_xyz_base.classList.add(PAGECSS.low_contrast);
    this.svg_uv_base.classList.add(PAGECSS.low_contrast);

    // Convert provided id input to an array, if it isn't already
    const uv_array = Array.isArray(uv_ids) ? uv_ids : [uv_ids];
    const xyz_array = Array.isArray(xyz_ids) ? xyz_ids : [xyz_ids];

    // Set up all UV svg highlighted elements
    const index_or_empty = (in_array, idx) => (idx < in_array.length) ? in_array[idx] : "";
    for (let k=0; k < this.svg_uv_hl_group.length; k++) {
      const hl_ref = this.svg_uv_hl_group[k];
      const target_id = index_or_empty(uv_array, k);
      set_svg_highlight(hl_ref, target_id);
    }

    // Set up all XYZ svg highlighted elements
    for (let k=0; k < this.svg_xyz_hl_group.length; k++) {
      const hl_ref = this.svg_xyz_hl_group[k];
      const target_id = index_or_empty(xyz_array, k);
      set_svg_highlight(hl_ref, target_id);
    }

    return;
  }

  // .................................................................................................................

  clear_text_highlights = () => {

    // Clear the highlighted list so we don't re-clear elements
    for (const txt_id of this._highlighted_text_ids) {
      const txt_elem = document.getElementById(txt_id);
      txt_elem.classList.remove(PAGECSS.text_highlight);
    };
    this._highlighted_text_ids = []

    return;
  }

  // .................................................................................................................

  highlight_text_entries = (text_ids) => {

    // Remove any existing highlight and tag the newly targeted elements
    this.clear_text_highlights();
    const id_array = Array.isArray(text_ids) ? text_ids : [text_ids];
    for (const elem_id of id_array) {
      const elem_ref = document.getElementById(elem_id);
      elem_ref.classList.add(PAGECSS.text_highlight);
      this._highlighted_text_ids.push(elem_id);
    }

    return;
  }

  // .................................................................................................................

  assign_svg_highlights = (select_id, uv_hl_ids, xyz_hl_ids) => {

    // Get a reference to the interactive element
    const select_elem = document.getElementById(select_id);
    
    // Add interaction callback
    const hl_callback = () => this.highlight_svg_elements(uv_hl_ids, xyz_hl_ids);
    select_elem.addEventListener("mouseover", hl_callback);

    return this;
  }

  // .................................................................................................................

  assign_text_highlights = (select_id, highlight_ids) => {

    // Get a reference to the interactive element
    const select_elem = document.getElementById(select_id);

    // Add interaction/clearing callbacks
    const hl_callback = () => this.highlight_text_entries(highlight_ids);
    select_elem.addEventListener("mouseover", hl_callback);
    select_elem.addEventListener("mouseout", this.clear_text_highlights);

    return this;
  }

  // .................................................................................................................

}

// ...................................................................................................................

function set_svg_highlight(hl_elem, target_id) {
  hl_elem.setAttribute("href", `#${target_id}`);
}
