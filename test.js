setTimeout(() => {
  const bg_spr = sprite_add("image/bg.png", 1, false, false, 0, 0);
  console.log(bg_spr);
  draw_sprite(bg_spr, 0, 0, 0, 0);
  //draw_text(0, 0, "TEST!");
}, 1000)