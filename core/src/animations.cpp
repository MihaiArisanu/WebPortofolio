

const char *frames[] = {
    R"(
       _ 
      (_)
      
      
    )",
    R"(
       
       _ 
      (_)
      
    )",
    R"(
       
       
       _ 
      (_)
    )",
    R"(
       
       
       
       _ 
     _(_)_
    )",
    R"(
       
       
       _ 
      (_)
    )",
    R"(
       
       _ 
      (_)
      
    )"};

extern "C" {
const char *getBasketballFrame(int tick) {
  int totalFrames = 6;
  int currentFrame = tick % totalFrames;

  return frames[currentFrame];
}
}