"""Render: manim -r 320,320 --fps 30 scripts/manim/intro.py TerminalIntro
Copy the resulting TerminalIntro.mp4 to public/animations/terminal-intro.mp4.
Requires manim==0.21.0 (build-time only).
"""
from manim import BLACK, WHITE, Create, FadeIn, Scene, Square, Text, config

config.background_color = BLACK
config.frame_width = 4
config.frame_height = 4


class TerminalIntro(Scene):
    def construct(self):
        frame = Square(side_length=3.9, color=WHITE, stroke_width=2)
        mark = Text(">_", font="JetBrainsMono Nerd Font", weight="BOLD", color=BLACK).scale(0.9)
        self.play(Create(frame), run_time=0.4)
        self.play(frame.animate.set_fill(WHITE, opacity=1), run_time=0.25)
        self.play(FadeIn(mark), run_time=0.25)
        self.wait(0.1)
