# ===========================================================================
# Project:   BodyBoard
# Copyright: ©2010 My Company, Inc.
# ===========================================================================

# Add initial buildfile information here

config :all, :required => [:sproutcore, :ki]

proxy '/', :to => 'bodyboard.couchone.com'