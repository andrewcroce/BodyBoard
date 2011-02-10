# ===========================================================================
# Project:   BodyBoard
# Copyright: ©2010 My Company, Inc.
# ===========================================================================

# Add initial buildfile information here

config :'Thoth-SC', :required => [:sproutcore]
config :'sproutcore-ui', :required => [:sproutcore]
config :body_board, :required => [:sproutcore, :ki, :'Thoth-SC']

proxy '/thoth', :to => '02.dev'