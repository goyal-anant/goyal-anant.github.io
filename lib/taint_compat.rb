# Ruby 3.2+ removed Object#taint/untaint/tainted? (deprecated since 2.7).
# The github-pages gem pins liquid = 4.0.3 exactly, and liquid 4.0.3's
# render path still calls String#tainted? internally, so it crashes on
# modern Ruby. Restore harmless no-op shims so that call site doesn't
# raise. Loaded via RUBYOPT before Bundler/Jekyll start (see bin/jekyll)
# so it applies regardless of Jekyll's plugin safe-mode. Local-build-only
# compatibility shim; has no effect on rendered site output.
unless Object.method_defined?(:tainted?)
  class Object
    def tainted?
      false
    end

    def taint
      self
    end

    def untaint
      self
    end
  end
end
