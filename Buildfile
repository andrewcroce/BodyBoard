# ===========================================================================
# Project:   BodyBoard
# Copyright: ©2010 My Company, Inc.
# ===========================================================================

# Add initial buildfile information here
config :all, :required => [:sproutcore, :ki, 'sproutcore/table']
proxy '/server', :to => '02.dev'